import path from 'path'
import { BrowserView, session } from 'electron'
import { CONSTANTS } from '../helpers/constants'
import Store from './store'
import { BrowserWindow } from './browser-window'

export class App {
  public window: BrowserWindow
  public application: BrowserView
  public rightBrowser: BrowserView
  public inactiveBrowsers = new Map<string, BrowserView>()
  public contextMenu: BrowserView
  public contextMenuInfo?: { id: string; type: 'tab' | 'profile' }
  public activeId: string = 'add' // Add id by default
  public activeTabState = new Map<string, string>()
  public store: Store

  constructor() {
    this.store = new Store()
    this.window = new BrowserWindow('main', {
      width: 1000,
      height: 600,
    })
    const [width, height] = this.window.self.getSize()
    this.application = this.addBrowser('application')
    this.application.setBounds({
      x: 0,
      y: CONSTANTS.headerHeight,
      width,
      height: height - CONSTANTS.headerHeight,
    })
    this.application.webContents.loadURL(CONSTANTS.APPLICATION_URL)
    this.setupListeners()
    if (!CONSTANTS.isProd) {
      this.setupDevtools()
    }
  }

  public openContextMenu(id: string, type: 'tab' | 'profile', bounds: Electron.Rectangle) {
    const { x, y } = bounds
    this.contextMenuInfo = { id, type }
    const contextMenu = this.addBrowser('context-menu')
    contextMenu.setBounds({ x: Math.floor(x), y: Math.floor(y), width: 80, height: 25 })
    if (this.contextMenu) {
      this.window.self.removeBrowserView(this.contextMenu)
    }
    this.contextMenu = contextMenu
    this.contextMenu.webContents.loadURL(CONSTANTS.CONTEXT_MENU_URL)
  }

  public closeContextMenu() {
    this.contextMenuInfo = undefined
    if (this.contextMenu) {
      this.window.self.removeBrowserView(this.contextMenu)
    }
  }

  private setupDevtools() {
    this.application.webContents.openDevTools({ mode: 'detach' })
    this.application.webContents.on('devtools-reload-page', (_event, _dirty, _image) => {
      console.log('RELOAD')
      this.application.webContents.reload()
    })
  }

  private setupListeners() {
    this.window.self.on('resize', () => {
      const [width, height] = this.window.self.getSize()
      this.application.setBounds({
        x: 0,
        y: CONSTANTS.headerHeight,
        width,
        height: height - CONSTANTS.headerHeight,
      })
      if (this.activeId !== 'add') {
        this.rightBrowser?.setBounds({
          x: CONSTANTS.sidebarWidth,
          y: CONSTANTS.headerHeight + CONSTANTS.profileSelectorHeight,
          width: width - CONSTANTS.sidebarWidth + CONSTANTS.extraWidth,
          height:
            height -
            CONSTANTS.headerHeight +
            CONSTANTS.extraHeight -
            CONSTANTS.profileSelectorHeight,
        })
      }
      this.window.state = { ...this.window.state, width, height }
    })
  }

  public addBrowser(id: string): BrowserView {
    const browser = new BrowserView({
      webPreferences: {
        session: session.fromPartition(id),
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
    let newHeight = height - CONSTANTS.headerHeight + CONSTANTS.extraHeight
    let y = CONSTANTS.headerHeight
    if (browser !== this.application) {
      newHeight = newHeight + CONSTANTS.profileSelectorHeight
      y = y + CONSTANTS.profileSelectorHeight
    }
    browser.setBounds({
      x: CONSTANTS.sidebarWidth,
      y,
      width: width - CONSTANTS.sidebarWidth + CONSTANTS.extraWidth,
      height: newHeight,
    })
  }

  public hideBrowser(id: string) {
    this.inactiveBrowsers.set(id, this.rightBrowser)
    // Move to a hidden position
    this.hide(this.inactiveBrowsers.get(id))
  }

  public maybeResumeBrowser(id: string): boolean {
    if (this.inactiveBrowsers.get(id)) {
      this.show(this.inactiveBrowsers.get(id))
      this.rightBrowser = this.inactiveBrowsers.get(id)
      return true
    }
    return false
  }
}
