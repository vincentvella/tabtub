import { app, BrowserView } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { CONSTANTS } from './helpers/constants'

const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  })
  const [width, height] = mainWindow.getSize()

  const sidebar = new BrowserView()
  mainWindow.addBrowserView(sidebar)
  sidebar.setBounds({
    x: 0,
    y: CONSTANTS.headerHeight,
    width: CONSTANTS.sidebarWidth,
    height: height,
  })
  sidebar.webContents.loadURL(CONSTANTS.SIDEBAR_URL)

  const rightView = new BrowserView()
  mainWindow.addBrowserView(rightView)
  rightView.setBounds({
    x: CONSTANTS.sidebarWidth,
    y: CONSTANTS.headerHeight,
    width: width - CONSTANTS.sidebarWidth,
    height: height,
  })
  rightView.webContents.loadURL(CONSTANTS.APPSTORE_URL)

  mainWindow.on('resize', () => {
    const [width, height] = mainWindow.getSize()
    sidebar.setBounds({
      x: 0,
      y: CONSTANTS.headerHeight,
      width: CONSTANTS.sidebarWidth,
      height,
    })
    rightView.setBounds({
      x: CONSTANTS.sidebarWidth,
      y: CONSTANTS.headerHeight,
      width: width - CONSTANTS.sidebarWidth,
      height,
    })
  })

  // When sidebar sends a message to the main process, we reload the right view
  sidebar.webContents.addListener('ipc-message', (_event, channel, message) => {
    if (channel === 'sidebar-message') {
      rightView.webContents.loadURL(message)
    }
    console.log('sidebar-message', message, channel)
  })

  sidebar.webContents.addListener(
    'console-message',
    (_event, _level, message) => {
      if (message.startsWith('[LINK_CLICKED]')) {
        const destination = message.replace('[LINK_CLICKED]', '')
        if (destination === 'app-store') {
          rightView.webContents.loadURL(CONSTANTS.APPSTORE_URL)
        } else {
          rightView.webContents.loadURL(message.replace('[LINK_CLICKED]', ''))
        }
      }
    }
  )

  sidebar.webContents.openDevTools({ mode: 'detach' })
})()

app.on('window-all-closed', () => {
  app.quit()
})
