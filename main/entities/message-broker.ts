import { ACTIONS } from "../api/actions";
import { CHANNELS } from "../api/events";
import { CONSTANTS } from "../helpers/constants";
import { App } from "./app";
import { Tab } from "./store";

export class MessageBroker {
	app: App

	constructor(app: App) {
		this.app = app
		// When sidebar sends a message to the main process, we reload the right view
		app.leftBrowser.webContents.addListener('ipc-message', this.handleMessage)
		app.rightBrowser.webContents.addListener('ipc-message', this.handleMessage)
	}

	private handleMessage: (event: Electron.Event, channel: string, ...args: any[]) => void = (_event, channel, data) => {
		switch (channel) {
			case ACTIONS.CHANGE_TAB:
				this.handleTabChange(data)
				break;
			case ACTIONS.ADD_TAB:
				this.addTab(data)
				break;
			case ACTIONS.REQUEST_TABS:
				this.handleTabsRequest()
				break;
			case ACTIONS.REMOVE_TAB:
				this.removeTab(data)
				break;
			default:
				console.log('UNHANDLED ACTION:', channel, data)
		}
	}

	private handleTabChange(tab: string) {
		console.log('Tab Change: ', tab)
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

	private handleTabsRequest() {
		console.log('Fetching Tabs From Storage')
		const urls = this.app.store.tabStorage.getAll() || []
		this.app.leftBrowser.webContents.send(CHANNELS.SIDEBAR, ACTIONS.REQUEST_TABS, urls)
		return urls
	}

	private addTab(tab: Tab) {
		console.log('Adding New Tab', tab)
		const id = this.app.store.tabStorage.set(tab)
		this.app.rightBrowser.webContents.send(CHANNELS.WINDOW, ACTIONS.ADD_TAB, id)
		const tabs = this.app.store.tabStorage.getAll()
		this.app.leftBrowser.webContents.send(CHANNELS.SIDEBAR, ACTIONS.SUBSCRIBE_TABS, tabs)
		this.handleTabChange(id)
		return id
	}

	private removeTab(id: string) {
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
}