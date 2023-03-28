import {
	ipcRenderer,
	contextBridge
} from 'electron'
import { ACTIONS } from './helpers/actions'
import { CHANNELS } from './helpers/events'

type ValueOf<T> = T[keyof T];
type Listener = (event: Electron.IpcRendererEvent, action: ValueOf<typeof ACTIONS>, data: any) => void

const resolver = (channel: ValueOf<typeof CHANNELS>, action: ValueOf<typeof CHANNELS>) => new Promise(resolve => {
	const listener: Listener = (_event, type, data) => {

		console.log(type, action)
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


// Expose protected methods off of window (ie. window.api.sendToA) 
// in order to use ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
	changeTab: function (id: string) {
		ipcRenderer.send(ACTIONS.CHANGE_TAB, id)
	},
	requestTabs: function () {
		ipcRenderer.send(ACTIONS.REQUEST_TABS)
	},
	receiveTabs: function (func) {
		ipcRenderer.on(CHANNELS.SIDEBAR, (event, ...args) => func(event, ...args));
	},
	getTabs: () => resolver(CHANNELS.SIDEBAR, ACTIONS.REQUEST_TABS),
})