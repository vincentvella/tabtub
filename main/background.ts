import { app as electron } from 'electron'
import serve from 'electron-serve'
import { App } from './entities/app'
import { CONSTANTS } from './helpers/constants'

if (CONSTANTS.isProd) {
	serve({ directory: 'app' })
} else {
	electron.setPath('userData', `${electron.getPath('userData')} (development)`)
}

; (async () => {
	await electron.whenReady()
	new App()
	// setTimeout(() => {
	// 	app.leftBrowser.webContents.send('[LEFT]')
	// }, 2000)
})()

electron.on('window-all-closed', () => {
	electron.quit()
})
