import { app as electron } from 'electron'
import serve from 'electron-serve'
import { App } from './entities/app'
import Store from 'electron-store'
import { MessageBroker } from './entities/message-broker'
import { CONSTANTS } from './helpers/constants'

if (CONSTANTS.isProd) {
	serve({ directory: 'app' })
} else {
	electron.setPath('userData', `${electron.getPath('userData')} (development)`)
}

; (async () => {
	await electron.whenReady()
	const app = new App()
	new MessageBroker(app)
})()

electron.on('window-all-closed', () => {
	electron.quit()
})
