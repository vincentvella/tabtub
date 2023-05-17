import { contextBridge } from 'electron'
import { ElectronApi } from './api'

// Expose protected methods off of window (ie. window.api.sendToA)
// in order to use ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', ElectronApi)

console.log('Context Bridge exposed...')
