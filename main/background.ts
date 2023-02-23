import { app, BrowserView } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

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

  const port = process.argv[2]
  const sidebarUrl = isProd
    ? 'app://./sidebar.html'
    : `http://localhost:${port}/sidebar`

  const sidebar = new BrowserView()
  mainWindow.addBrowserView(sidebar)
  sidebar.setBounds({ x: 0, y: 0, width: 300, height: 600 })
  sidebar.webContents.loadURL(sidebarUrl)

  const rightView = new BrowserView()
  mainWindow.addBrowserView(rightView)
  rightView.setBounds({ x: 300, y: 0, width: 700, height: 600 })
  rightView.webContents.loadURL('https://mail.google.com')

  mainWindow.on('resize', () => {
    const [width, height] = mainWindow.getSize()
    sidebar.setBounds({ x: 0, y: 0, width: 300, height })
    rightView.setBounds({ x: 300, y: 0, width: width - 300, height })
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
    (_event, level, message, line, sourceId) => {
      if (message.startsWith('[LINK_CLICKED]')) {
        rightView.webContents.loadURL(message.replace('[LINK_CLICKED]', ''))
      }
    }
  )

  sidebar.webContents.openDevTools({ mode: 'detach' })
})()

app.on('window-all-closed', () => {
  app.quit()
})
