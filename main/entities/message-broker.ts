import { ACTIONS } from "../api/actions";
import { CHANNELS } from "../api/events";
import { CONSTANTS } from "../helpers/constants";
import { App } from "./app";
import { Tab } from "./store";

type MessageBrokerHandlerKeys = keyof InstanceType<typeof MessageBroker>

export class MessageBroker {
	private app: App

	constructor(app: App) {
		this.app = app
		// When sidebar sends a message to the main process, we reload the right view
		app.leftBrowser.webContents.addListener('ipc-message', this.handleMessage)
		app.rightBrowser.webContents.addListener('ipc-message', this.handleMessage)
	}

	private eventMap: Record<string, MessageBrokerHandlerKeys> = {
		[ACTIONS.ADD_TAB]: 'addTab',
		[ACTIONS.CHANGE_TAB]: 'handleTabChange',
		[ACTIONS.CLOSE_CONTEXT_MENU]: 'closeContextMenu',
		[ACTIONS.GET_CONTEXT_MENU]: 'getContextMenu',
		[ACTIONS.OPEN_CONTEXT_MENU]: 'openContextMenu',
		[ACTIONS.REMOVE_TAB]: 'removeTab',
		[ACTIONS.REQUEST_TABS]: 'removeTab',
	}

	private handleMessage: (event: Electron.Event, channel: string, ...args: any[]) => void = (_event, channel, data) => {
		console.log('DISPATCHING', channel)
		if (this.eventMap[channel]) {
			this[this.eventMap[channel]](data)
		} else {
			console.log('UNHANDLED ACTION:', channel, data)
		}
	}

	public handleTabChange(tab: string) {
		if (tab === 'add') {
			// Special case to load the add page
			if (tab !== this.app.activeUrl) {
				this.app.activeUrl = tab
				this.app.rightBrowser.webContents.loadURL(CONSTANTS.ADD_URL)
			}
		} else {
			this.app.activeUrl = this.app.store.tabStorage.get(tab).url
			this.app.rightBrowser.webContents.loadURL(this.app.activeUrl)
		}
	}

	public handleTabsRequest() {
		const urls = this.app.store.tabStorage.getAll() || []
		this.app.leftBrowser.webContents.send(CHANNELS.SIDEBAR, ACTIONS.REQUEST_TABS, urls)
		return urls
	}

	public addTab(tab: Tab) {
		const id = this.app.store.tabStorage.set(tab)
		this.app.rightBrowser.webContents.send(CHANNELS.WINDOW, ACTIONS.ADD_TAB, id)
		const tabs = this.app.store.tabStorage.getAll()
		this.app.leftBrowser.webContents.send(CHANNELS.SIDEBAR, ACTIONS.SUBSCRIBE_TABS, tabs)
		this.handleTabChange(id)
		return id
	}

	public removeTab(id: string) {
		// Get url for removed id
		const activeTab = this.app.store.tabStorage.get(id).url
		this.app.store.tabStorage.remove(id)
		// If deleted url is the same as active... navigate the user to the add screen
		if (this.app.activeUrl === activeTab) {
			this.handleTabChange('add')
		}
		const tabs = this.app.store.tabStorage.getAll()
		this.app.leftBrowser.webContents.send(CHANNELS.SIDEBAR, ACTIONS.SUBSCRIBE_TABS, tabs)
	}

	public openContextMenu({ id, bounds }: { id: string, bounds: Electron.Rectangle }) {
		this.app.openContextMenu(id, bounds)
		// To debug context menu
		// this.app.contextMenu.webContents.openDevTools({ mode: 'detach' })
		this.app.contextMenu.webContents.addListener('ipc-message', this.handleMessage)
		this.app.rightBrowser.webContents.addListener('focus', () => this.closeContextMenu())
	}

	public closeContextMenu() {
		this.app.contextMenu?.webContents.removeListener('ipc-message', this.handleMessage)
		this.app.closeContextMenu()
	}

	public getContextMenu() {
		this.app.contextMenu.webContents.send(CHANNELS.CONTEXT_MENU, ACTIONS.GET_CONTEXT_MENU, this.app.contextMenuId)
		return this.app.contextMenuId
	}
}