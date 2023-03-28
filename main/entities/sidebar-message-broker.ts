import { ACTIONS } from "../api/actions";
import { CHANNELS } from "../api/events";
import { CONSTANTS } from "../helpers/constants";
import { App } from "./app";

export class SidebarMessageBroker {
	app: App

	constructor(app: App) {
		this.app = app
		// When sidebar sends a message to the main process, we reload the right view
		app.leftBrowser.webContents.addListener('ipc-message', this.handleMessage)
	}

	private handleMessage: (event: Electron.Event, channel: string, ...args: any[]) => void = (_event, channel, message) => {
		switch (channel) {
			case ACTIONS.CHANGE_TAB:
				this.handleTabChange(message)
				break;
			case ACTIONS.REQUEST_TABS:
				this.handleTabsRequest()
				break;
			default:
				console.log('UNHANDLED ACTION:', channel, message)
		}
	}

	private handleTabChange(message: string) {
		console.log('Tab Change: ', message)
		if (message === 'add') {
			// Special case to load the add page
			if (message !== this.app.activeUrl) {
				this.app.activeUrl = message
				this.app.rightBrowser.webContents.loadURL(CONSTANTS.ADD_URL)
			}
		} else {
			this.app.activeUrl = message
			this.app.rightBrowser.webContents.loadURL(message)
		}
	}

	private handleTabsRequest() {
		console.log('Fetching Tabs From Storage')
		this.app.leftBrowser.webContents.send(CHANNELS.SIDEBAR, ACTIONS.REQUEST_TABS, [])
		return []
	}
}