import { ipcRenderer } from 'electron';
import { ACTIONS } from './actions'
import { CHANNELS } from './events'

type ValueOf<T> = T[keyof T];
type Listener = (event: Electron.IpcRendererEvent, action: ValueOf<typeof ACTIONS>, data: any) => void

const resolver = (channel: ValueOf<typeof CHANNELS>, action: ValueOf<typeof CHANNELS>) => new Promise(resolve => {
	const listener: Listener = (_event, type, data) => {
		// Multiple listeners allowed but the type guarding resolves the data
		if (type === action) {
			resolve(data)
		}
	}
	// Sets up listener for action resolution - resolves promise once completed.
	ipcRenderer.on(channel, listener)
	// Invoke action
	ipcRenderer.send(action)
})

export type Api = typeof ElectronApi

export const ElectronApi = {
	changeTab: function (id: string) {
		ipcRenderer.send(ACTIONS.CHANGE_TAB, id)
	},
	getTabs: () => resolver(CHANNELS.SIDEBAR, ACTIONS.REQUEST_TABS),
}
