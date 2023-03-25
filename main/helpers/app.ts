import { BrowserView, BrowserWindow } from 'electron'
import { CONSTANTS } from './constants'
import createWindow from './create-window'

export class WindowState {
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
    this.rightBrowser.webContents.loadURL(CONSTANTS.APPSTORE_URL)
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
        if (channel === 'sidebar-message') {
          this.rightBrowser.webContents.loadURL(message)
        }
        console.log('sidebar-message', message, channel)
      }
    )

    this.leftBrowser.webContents.addListener(
      'console-message',
      (_event, _level, message) => {
        if (message.startsWith('[LINK_CLICKED]')) {
          const destination = message.replace('[LINK_CLICKED]', '')
          if (destination === 'add' && destination !== this.activeUrl) {
            this.activeUrl = destination
            this.rightBrowser.webContents.loadURL(CONSTANTS.APPSTORE_URL)
          } else {
            this.activeUrl = destination
            this.rightBrowser.webContents.loadURL(
              message.replace('[LINK_CLICKED]', '')
            )
          }
        }
      }
    )
  }

  private addBrowser(): BrowserView {
    const browser = new BrowserView()
    this.window.addBrowserView(browser)
    return browser
  }
}
