import { app } from 'electron'
import serve from 'electron-serve'
import { WindowState } from './helpers/app'
import { CONSTANTS } from './helpers/constants'

if (CONSTANTS.isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()
  new WindowState()
})()

app.on('window-all-closed', () => {
  app.quit()
})
