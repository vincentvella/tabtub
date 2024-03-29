import { Menu, MenuItem, MenuItemConstructorOptions } from 'electron'
import { ACTIONS } from '../api/actions'
import { CHANNELS } from '../api/events'
import { App } from './app'
import { Profile, Tab } from './store'
import { createMenuTemplate } from '../helpers/template'

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
    [ACTIONS.ADD_PROFILE]: 'addProfile',
    [ACTIONS.CHANGE_TAB]: 'handleTabChange',
    [ACTIONS.CHANGE_PROFILE]: 'handleProfileChange',
    [ACTIONS.CLOSE_CONTEXT_MENU]: 'closeContextMenu',
    [ACTIONS.GET_CONTEXT_MENU]: 'getContextMenu',
    [ACTIONS.OPEN_CONTEXT_MENU]: 'openContextMenu',
    [ACTIONS.REMOVE_TAB]: 'removeTab',
    [ACTIONS.REMOVE_PROFILE]: 'removeProfile',
    [ACTIONS.REQUEST_TABS]: 'handleTabsRequest',
    [ACTIONS.REQUEST_PROFILES]: 'handleProfilesRequest',
    [ACTIONS.UPDATE_PROFILE]: 'updateProfile',
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

  private getActiveProfileForTab(tabId: string) {
    const profiles = this.app.store.profileStorage.getByTabId(tabId)
    const profile =
      profiles.find((p) => p.id === this.app.activeTabState.get(tabId))?.id || // find most recent active profile
      profiles[0].id // or default to first profile
    return profile
  }

  public handleTabChange(id: string) {
    if (id === 'add') {
      this.app.hide(this.app.rightBrowser)
      if (id !== this.app.activeId) {
        this.app.activeId = id
      }
    } else {
      // Get the active profile for the tab
      if (this.app.activeId !== 'add') {
        const prevProfile = this.getActiveProfileForTab(this.app.activeId)
        // Hide the current browser excluding the add route
        this.app.hideBrowser(prevProfile)
      }

      // Get the active profile for the tab

      // Set the active tab and profile
      this.app.activeId = id
      const profile = this.getActiveProfileForTab(this.app.activeId)
      this.app.activeTabState.set(this.app.activeId, profile)

      // Check if the active browser exists in cache and resume it
      const resumed = this.app.maybeResumeBrowser(profile)
      if (!resumed) {
        // If we don't resume an existing browser session, we add a new browser
        this.app.rightBrowser = this.app.addBrowser(`persist:${this.app.activeId}-${profile}`)
        const url = this.app.store.tabStorage.get(this.app.activeId).url
        this.app.rightBrowser.webContents.loadURL(url)
        this.app.show(this.app.rightBrowser)
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
    this.updateTabMenu()
  }

  private updateTabMenu() {
    const urls = this.app.store.tabStorage.getAll()

    const template = createMenuTemplate()
    const fileMenu = template.find((item) => item.role === 'fileMenu')!

    const tabsSubmenu = []
    const profilesSubmenu = []
    urls.forEach((url, index) => {
      tabsSubmenu.push({
        label: url.url.replace('https://', '').replace('http://', '').split('/')[0] || url.url,
        accelerator: 'Cmd+' + (index + 1),
        id: url.id,
        click: () => this.handleTabChange(url.id),
      })
    })
    ;(fileMenu.submenu! as MenuItemConstructorOptions[]).unshift({
      label: 'Tabs',
      submenu: tabsSubmenu,
    })

    const profiles = this.handleProfilesRequest(this.app.activeId)
    profiles.forEach((profile, index) => {
      profilesSubmenu.push({
        label: profile.name,
        accelerator: 'Cmd+Shift+' + (index + 1),
        id: profile.id,
        click: () => this.handleProfileChange(profile.id),
      })
    })
    ;(fileMenu.submenu! as MenuItemConstructorOptions[]).unshift({
      label: 'Profiles',
      submenu: profilesSubmenu,
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }

  public handleProfileChange(id: string) {
    // Hide current browser
    this.app.hideBrowser(this.app.activeTabState.get(this.app.activeId))

    // Check if the active browser exists in cache and resume it
    const resumed = this.app.maybeResumeBrowser(id)
    if (!resumed) {
      // If we don't resume an existing browser session, we add a new browser
      this.app.rightBrowser = this.app.addBrowser(`persist:${this.app.activeId}-${id}`)
      const url = this.app.store.tabStorage.get(this.app.activeId).url
      this.app.rightBrowser.webContents.loadURL(url)
      this.app.show(this.app.rightBrowser)
    }
    // this.app.rightBrowser.webContents.openDevTools({ mode: 'detach' })
    this.app.rightBrowser.webContents.addListener('focus', () => this.closeContextMenu())
    // Set the active profile
    this.app.activeTabState.set(this.app.activeId, id)

    this.app.application.webContents.send(
      CHANNELS.APPLICATION,
      ACTIONS.SUBSCRIBE_ACTIVE_PROFILE,
      this.app.activeTabState.get(this.app.activeId)
    )
    this.updateTabMenu()
  }

  public handleTabsRequest() {
    const urls = this.app.store.tabStorage.getAll() || []
    this.app.application.webContents.send(CHANNELS.APPLICATION, ACTIONS.REQUEST_TABS, urls)
    this.updateTabMenu()
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

  public addProfile() {
    const profile: Omit<Profile, 'id'> = { name: 'New Profile', tabId: this.app.activeId }
    const id = this.app.store.profileStorage.set(profile)
    const profiles = this.app.store.profileStorage.getByTabId(this.app.activeId)
    this.app.application.webContents.send(
      CHANNELS.APPLICATION,
      ACTIONS.SUBSCRIBE_PROFILES,
      profiles
    )
    this.handleProfileChange(id)
    return id
  }

  public updateProfile({ id, name }: Omit<Profile, 'tabId'>) {
    this.app.store.profileStorage.updateProfile(id, name)
    const profiles = this.app.store.profileStorage.getByTabId(this.app.activeId)
    this.app.application.webContents.send(
      CHANNELS.APPLICATION,
      ACTIONS.SUBSCRIBE_PROFILES,
      profiles
    )
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

  public removeProfile(id: string) {
    const prevProfiles = this.app.store.profileStorage.getByTabId(this.app.activeId)
    if (prevProfiles.length === 1) {
      this.removeTab(this.app.activeId)
    } else {
      const nextProfile = prevProfiles.find((p) => p.id !== id)
      this.app.store.profileStorage.remove(id)
      const profiles = this.app.store.profileStorage.getByTabId(this.app.activeId)
      this.handleProfileChange(nextProfile.id)
      this.app.application.webContents.send(
        CHANNELS.APPLICATION,
        ACTIONS.SUBSCRIBE_PROFILES,
        profiles
      )
    }
  }

  public openContextMenu({
    id,
    type,
    bounds,
  }: {
    id: string
    type: 'tab' | 'profile'
    bounds: Electron.Rectangle
  }) {
    this.app.openContextMenu(id, type, bounds)
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
      this.app.contextMenuInfo
    )
    return this.app.contextMenuInfo
  }
}
