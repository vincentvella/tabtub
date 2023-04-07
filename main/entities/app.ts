import path from 'path'
import { BrowserView, BrowserWindow } from 'electron'
import { CONSTANTS } from '../helpers/constants'
import createWindow from '../helpers/create-window'
import Store from './store'

export class App {
	public window: BrowserWindow
	public leftBrowser: BrowserView
	public rightBrowser: BrowserView
	public contextMenu: BrowserView
	public contextMenuId?: string
	public activeUrl: string
	public store: Store

	constructor() {
		this.store = new Store()
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

	public openContextMenu(id: string, bounds: Electron.Rectangle) {
		this.contextMenuId = id
		const contextMenu = this.addBrowser()
		contextMenu.setBounds({ ...bounds, width: 80, height: 25 })
		if (this.contextMenu) {
			this.window.removeBrowserView(this.contextMenu)
		}
		this.contextMenu = contextMenu
		this.contextMenu.webContents.loadURL(CONSTANTS.CONTEXT_MENU_URL)
	}

	public closeContextMenu() {
		this.contextMenuId = undefined
		if (this.contextMenu) {
			this.window.removeBrowserView(this.contextMenu)
		}
	}

	private setupDevtools() {
		this.leftBrowser.webContents.openDevTools({ mode: 'detach' })
		this.rightBrowser.webContents.openDevTools({ mode: 'detach' })
		this.leftBrowser.webContents.on(
			'devtools-reload-page',
			(_event, _dirty, _image) => {
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
}