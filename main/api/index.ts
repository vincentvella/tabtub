import { ipcRenderer } from 'electron';
import { Tab } from '../entities/store';
import { ACTIONS } from './actions'
import { CHANNELS } from './events'

type ValueOf<T> = T[keyof T];
type Listener = (event: Electron.IpcRendererEvent, action: ValueOf<typeof ACTIONS>, data: any) => void
type Callback = (data: any) => void

const resolver = (channel: ValueOf<typeof CHANNELS>, action: ValueOf<typeof CHANNELS>, ...data: any[]) => new Promise(resolve => {
	const listener: Listener = (_event, type, data) => {
		// Multiple listeners allowed but the type guarding resolves the data
		if (type === action) {
			resolve(data)
		}
	}
	// Sets up listener for action resolution - resolves promise once completed.
	ipcRenderer.on(channel, listener)
	// Invoke action
	ipcRenderer.send(action, ...data)
})

export type Api = typeof ElectronApi

export const ElectronApi = {
	changeTab: (id: string) => ipcRenderer.send(ACTIONS.CHANGE_TAB, id),
	addTab: (tab: Tab) => resolver(CHANNELS.WINDOW, ACTIONS.ADD_TAB, tab),
	getTabs: () => resolver(CHANNELS.SIDEBAR, ACTIONS.REQUEST_TABS),
	subscribeToTabs: (func: Callback) => {
		const listener: Listener = (_event, type, data) => {
			if (type === ACTIONS.SUBSCRIBE_TABS) {
				// When new tabs are created, we send an update to subscribers in the UI
				func(data)
			}
		}
		ipcRenderer.on(CHANNELS.SIDEBAR, listener)
	}
}
