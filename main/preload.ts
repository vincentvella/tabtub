import {
	ipcRenderer,
	contextBridge
} from 'electron'
import { ACTIONS } from './helpers/actions'


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
		ipcRenderer.on('[TABS]', (event, ...args) => func(event, ...args));
	},
	requestStorage: function () {
		ipcRenderer.send('[LEFT]', 'message??');
	},
	receiveFromMain: function (func) {
		ipcRenderer.on('[LEFT]', (event, ...args) => func(event, ...args));
	},
})