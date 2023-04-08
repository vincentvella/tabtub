import path from 'path'
import { BrowserView } from 'electron'
import { CONSTANTS } from '../helpers/constants'
import Store from './store'
import { BrowserWindow } from './browser-window'

// this.rightBrowser = this.addBrowser()
// this.rightBrowser.setBounds({
//   x: CONSTANTS.sidebarWidth,
//   y: CONSTANTS.headerHeight,
//   width: width - CONSTANTS.sidebarWidth,
//   height: height - CONSTANTS.headerHeight,
// })
// this.rightBrowser.webContents.loadURL(CONSTANTS.ADD_URL)

export class App {
  public window: BrowserWindow
  public addPage: BrowserView
  public sidebar: BrowserView
  public rightBrowser: BrowserView
  public inactiveBrowsers: Record<string, BrowserView> = {}
  public contextMenu: BrowserView
  public contextMenuId?: string
  public activeId: string = 'add' // Add id by default
  public store: Store

  constructor() {
    this.store = new Store()
    this.window = new BrowserWindow('main', {
      width: 1000,
      height: 600,
    })
    const [width, height] = this.window.self.getSize()
    this.sidebar = this.addBrowser()
    this.sidebar.setBounds({
      x: 0,
      y: CONSTANTS.headerHeight,
      width: CONSTANTS.sidebarWidth,
      height: height - CONSTANTS.headerHeight,
    })
    this.sidebar.webContents.loadURL(CONSTANTS.SIDEBAR_URL)
    this.addPage = this.addBrowser()
    this.addPage.setBounds({
      x: CONSTANTS.sidebarWidth,
      y: CONSTANTS.headerHeight,
      width: width - CONSTANTS.sidebarWidth,
      height: height - CONSTANTS.headerHeight,
    })
    this.addPage.webContents.loadURL(CONSTANTS.ADD_URL)
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
      this.window.self.removeBrowserView(this.contextMenu)
    }
    this.contextMenu = contextMenu
    this.contextMenu.webContents.loadURL(CONSTANTS.CONTEXT_MENU_URL)
  }

  public closeContextMenu() {
    this.contextMenuId = undefined
    if (this.contextMenu) {
      this.window.self.removeBrowserView(this.contextMenu)
    }
  }

  private setupDevtools() {
    this.sidebar.webContents.openDevTools({ mode: 'detach' })
    this.addPage.webContents.openDevTools({ mode: 'detach' })
    this.sidebar.webContents.on('devtools-reload-page', (_event, _dirty, _image) => {
      console.log('RELOAD')
      this.sidebar.webContents.reload()
      this.addPage.webContents.reload()
    })
  }

  private setupListeners() {
    this.window.self.on('resize', () => {
      const [width, height] = this.window.self.getSize()
      this.sidebar.setBounds({
        x: 0,
        y: CONSTANTS.headerHeight,
        width: CONSTANTS.sidebarWidth,
        height: height - CONSTANTS.headerHeight,
      })
      this.addPage.setBounds({
        x: CONSTANTS.sidebarWidth,
        y: CONSTANTS.headerHeight,
        width: width - CONSTANTS.sidebarWidth,
        height: height - CONSTANTS.headerHeight,
      })
      this.window.state = { ...this.window.state, width, height }
    })
  }

  public addBrowser(): BrowserView {
    const browser = new BrowserView({
      webPreferences: {
        preload: path.join(path.resolve(__dirname, '../app', 'preload.js')),
      },
    })
    this.window.self.addBrowserView(browser)
    return browser
  }

  public hide(browser: BrowserView) {
    if (browser) {
      browser.setBounds({ height: 1, y: -1, width: this.window.state.width, x: 0 })
    }
  }

  public show(browser: BrowserView) {
    const { width, height } = this.window.state
    browser.setBounds({
      x: CONSTANTS.sidebarWidth,
      y: CONSTANTS.headerHeight,
      width: width - CONSTANTS.sidebarWidth,
      height: height - CONSTANTS.headerHeight,
    })
  }

  public hideBrowser(id: string) {
    this.inactiveBrowsers[id] = this.rightBrowser
    // Move to a hidden position
    this.hide(this.inactiveBrowsers[id])
  }

  public maybeResumeBrowser(id: string): boolean {
    if (this.inactiveBrowsers[id]) {
      this.show(this.inactiveBrowsers[id])
      this.rightBrowser = this.inactiveBrowsers[id]
      return true
    }
    return false
  }
}
