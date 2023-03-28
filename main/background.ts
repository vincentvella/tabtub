import { app as electron } from 'electron'
import serve from 'electron-serve'
import { App } from './entities/app'
import { SidebarMessageBroker } from './entities/sidebar-message-broker'
import { CONSTANTS } from './helpers/constants'

if (CONSTANTS.isProd) {
	serve({ directory: 'app' })
} else {
	electron.setPath('userData', `${electron.getPath('userData')} (development)`)
}

; (async () => {
	await electron.whenReady()
	const app = new App()
	new SidebarMessageBroker(app)
})()

electron.on('window-all-closed', () => {
	electron.quit()
})
