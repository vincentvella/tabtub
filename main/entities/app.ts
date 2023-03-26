import path from 'path'
import { BrowserView, BrowserWindow } from 'electron'
import { CONSTANTS } from '../helpers/constants'
import createWindow from '../helpers/create-window'
import { ACTIONS } from '../helpers/actions'

export class App {
	public window: BrowserWindow
	public leftBrowser: BrowserView
	public rightBrowser: BrowserView
	private activeUrl: string

	constructor() {
		this.window = createWindow('main', {
			width: 1000,
			height: 600,
		})
		const [width, height] = this.window.getSize()
		this.leftBrowser = this.addBrowser()
		this.leftBrowser.setBounds({
			x: 0,
			y: CONSTANTS.headerHeight,
			width: CONSTANTS.sidebarWidth,
			height,
		})
		this.leftBrowser.webContents.loadURL(CONSTANTS.SIDEBAR_URL)
		this.rightBrowser = this.addBrowser()
		this.rightBrowser.setBounds({
			x: CONSTANTS.sidebarWidth,
			y: CONSTANTS.headerHeight,
			width: width - CONSTANTS.sidebarWidth,
			height,
		})
		this.rightBrowser.webContents.loadURL(CONSTANTS.ADD_URL)
		this.setupListeners()
		if (!CONSTANTS.isProd) {
			this.setupDevtools()
		}
	}

	private setupDevtools() {
		this.leftBrowser.webContents.openDevTools({ mode: 'detach' })
		this.rightBrowser.webContents.openDevTools({ mode: 'detach' })
		this.leftBrowser.webContents.on(
			'devtools-reload-page',
			(event, dirty, image) => {
				console.log('RELOAD')
				this.leftBrowser.webContents.reload()
				this.rightBrowser.webContents.reload()
			}
		)
	}

	private setupListeners() {
		this.window.on('resize', () => {
			const [width, height] = this.window.getSize()
			this.leftBrowser.setBounds({
				x: 0,
				y: CONSTANTS.headerHeight,
				width: CONSTANTS.sidebarWidth,
				height,
			})
			this.rightBrowser.setBounds({
				x: CONSTANTS.sidebarWidth,
				y: CONSTANTS.headerHeight,
				width: width - CONSTANTS.sidebarWidth,
				height,
			})
		})

		// When sidebar sends a message to the main process, we reload the right view
		this.leftBrowser.webContents.addListener(
			'ipc-message',
			(_event, channel, message) => {
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
		)
	}

	private addBrowser(): BrowserView {
		const browser = new BrowserView({
			webPreferences: {
				preload: path.join(path.resolve(__dirname, '../app', 'preload.js'))
			}
		})
		this.window.addBrowserView(browser)
		return browser
	}

	private handleTabChange(message: string) {
		console.log('Tab Change: ', message)
		if (message === 'add') {
			// Special case to load the add page
			if (message !== this.activeUrl) {
				this.activeUrl = message
				this.rightBrowser.webContents.loadURL(CONSTANTS.ADD_URL)
			}
		} else {
			this.activeUrl = message
			this.rightBrowser.webContents.loadURL(message)
		}
	}

	private handleTabsRequest() {
		console.log('Fetching Tabs From Storage')
		this.leftBrowser.webContents.send('[TABS]', {})
		return []
	}
}
