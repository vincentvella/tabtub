import { ACTIONS } from '../api/actions'
import { CHANNELS } from '../api/events'
import { App } from './app'
import { Tab } from './store'

type MessageBrokerHandlerKeys = keyof InstanceType<typeof MessageBroker>

export class MessageBroker {
  private app: App

  constructor(app: App) {
    this.app = app
    // When sidebar sends a message to the main process, we reload the right view
    app.application.webContents.addListener('ipc-message', this.handleMessage)
    // app.rightBrowser.webContents.addListener('ipc-message', this.handleMessage)
  }

  private eventMap: Record<string, MessageBrokerHandlerKeys> = {
    [ACTIONS.ADD_TAB]: 'addTab',
    [ACTIONS.CHANGE_TAB]: 'handleTabChange',
    [ACTIONS.CLOSE_CONTEXT_MENU]: 'closeContextMenu',
    [ACTIONS.GET_CONTEXT_MENU]: 'getContextMenu',
    [ACTIONS.OPEN_CONTEXT_MENU]: 'openContextMenu',
    [ACTIONS.REMOVE_TAB]: 'removeTab',
    [ACTIONS.REQUEST_TABS]: 'handleTabsRequest',
    [ACTIONS.REQUEST_PROFILES]: 'handleProfilesRequest',
  }

  private handleMessage: (event: Electron.Event, channel: string, ...args: any[]) => void = (
    _event,
    channel,
    data
  ) => {
    console.log('DISPATCHING', channel)
    if (this.eventMap[channel]) {
      this[this.eventMap[channel]](data)
    } else {
      console.log('UNHANDLED ACTION:', channel, data)
    }
  }

  public handleTabChange(id: string) {
    if (id === 'add') {
      this.app.hide(this.app.rightBrowser)
      if (id !== this.app.activeId) {
        this.app.activeId = id
      }
    } else {
      if (this.app.activeId !== 'add') {
        // Hide the current browser excluding the add route
        this.app.hideBrowser(this.app.activeId)
      }
      // Set the active browser
      this.app.activeId = id
      // Check if the active browser exists in cache and resume it
      const resumed = this.app.maybeResumeBrowser(this.app.activeId)
      if (!resumed) {
        // If we don't resume an existing browser session, we add a new browser
        this.app.rightBrowser = this.app.addBrowser()
        const url = this.app.store.tabStorage.get(this.app.activeId).url
        this.app.rightBrowser.webContents.loadURL(url)
        this.app.show(this.app.rightBrowser)
        const profile = this.app.store.profileStorage.getByTabId(this.app.activeId)[0]
        this.app.activeTabState.set(this.app.activeId, profile.id)
      }
      // this.app.rightBrowser.webContents.openDevTools({ mode: 'detach' })
      this.app.rightBrowser.webContents.addListener('focus', () => this.closeContextMenu())
    }
    this.app.application.webContents.send(
      CHANNELS.APPLICATION,
      ACTIONS.SUBSCRIBE_ACTIVE_TAB,
      this.app.activeId
    )
    this.app.application.webContents.send(
      CHANNELS.APPLICATION,
      ACTIONS.SUBSCRIBE_ACTIVE_PROFILE,
      this.app.activeTabState.get(this.app.activeId)
    )
  }

  public handleTabsRequest() {
    const urls = this.app.store.tabStorage.getAll() || []
    this.app.application.webContents.send(CHANNELS.APPLICATION, ACTIONS.REQUEST_TABS, urls)
    return urls
  }

  public handleProfilesRequest(activeTab: string) {
    const profiles = this.app.store.profileStorage.getByTabId(activeTab) || []
    this.app.application.webContents.send(CHANNELS.APPLICATION, ACTIONS.REQUEST_PROFILES, profiles)
    return profiles
  }

  public addTab(tab: Tab) {
    const { id, profile } = this.app.store.addTab(tab)
    this.app.application.webContents.send(CHANNELS.WINDOW, ACTIONS.ADD_TAB, id)
    const tabs = this.app.store.tabStorage.getAll()
    this.app.application.webContents.send(CHANNELS.APPLICATION, ACTIONS.SUBSCRIBE_TABS, tabs)
    const profiles = this.app.store.profileStorage.getAll()
    this.app.application.webContents.send(
      CHANNELS.APPLICATION,
      ACTIONS.SUBSCRIBE_PROFILES,
      profiles
    )
    this.handleTabChange(id)
    return id
  }

  public removeTab(id: string) {
    // Get url for removed id
    this.app.store.removeTab(id)
    // If deleted url is the same as active... navigate the user to the add screen
    if (this.app.activeId === id) {
      this.handleTabChange('add')
    }
    const tabs = this.app.store.tabStorage.getAll()
    this.app.application.webContents.send(CHANNELS.APPLICATION, ACTIONS.SUBSCRIBE_TABS, tabs)
  }

  public openContextMenu({ id, bounds }: { id: string; bounds: Electron.Rectangle }) {
    this.app.openContextMenu(id, bounds)
    // To debug context menu
    // this.app.contextMenu.webContents.openDevTools({ mode: 'detach' })
    this.app.contextMenu.webContents.addListener('ipc-message', this.handleMessage)
    this.app.contextMenu.webContents.focus()
    this.app.application.webContents.addListener('focus', () => this.closeContextMenu())
  }

  public closeContextMenu() {
    this.app.contextMenu?.webContents.removeListener('ipc-message', this.handleMessage)
    this.app.closeContextMenu()
  }

  public getContextMenu() {
    this.app.contextMenu.webContents.send(
      CHANNELS.CONTEXT_MENU,
      ACTIONS.GET_CONTEXT_MENU,
      this.app.contextMenuId
    )
    return this.app.contextMenuId
  }
}
