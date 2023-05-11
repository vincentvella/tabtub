import { ipcRenderer } from 'electron'
import { Tab } from '../entities/store'
import { ACTIONS } from './actions'
import { CHANNELS } from './events'

type ValueOf<T> = T[keyof T]
type Listener = (
  event: Electron.IpcRendererEvent,
  action: ValueOf<typeof ACTIONS>,
  data: any
) => void
type Callback = (data: any) => void

const resolver = (
  channel: ValueOf<typeof CHANNELS>,
  action: ValueOf<typeof CHANNELS>,
  ...data: any[]
) =>
  new Promise((resolve) => {
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
  addTab: (tab: Omit<Tab, 'id'>) => resolver(CHANNELS.WINDOW, ACTIONS.ADD_TAB, tab),
  changeTab: (id: string) => ipcRenderer.send(ACTIONS.CHANGE_TAB, id),
  getTabs: () => resolver(CHANNELS.APPLICATION, ACTIONS.REQUEST_TABS),
  getProfiles: (activeTabId: string) =>
    resolver(CHANNELS.APPLICATION, ACTIONS.REQUEST_PROFILES, activeTabId),
  closeContextMenu: () => resolver(CHANNELS.APPLICATION, ACTIONS.CLOSE_CONTEXT_MENU),
  getContextMenu: () => resolver(CHANNELS.CONTEXT_MENU, ACTIONS.GET_CONTEXT_MENU),
  openContextMenu: (id: string, bounds: Pick<Electron.Rectangle, 'x' | 'y'>) =>
    resolver(CHANNELS.APPLICATION, ACTIONS.OPEN_CONTEXT_MENU, { id, bounds }),
  removeTab: (id: string) => resolver(CHANNELS.APPLICATION, ACTIONS.REMOVE_TAB, id),
  subscribeToActiveTab: (func: Callback) => {
    const listener: Listener = (_event, type, data) => {
      if (type === ACTIONS.SUBSCRIBE_ACTIVE_TAB) {
        func(data)
      }
    }
    ipcRenderer.on(CHANNELS.APPLICATION, listener)
  },
  subscribeToTabs: (func: Callback) => {
    const listener: Listener = (_event, type, data) => {
      if (type === ACTIONS.SUBSCRIBE_TABS) {
        // When new tabs are created, we send an update to subscribers in the UI
        func(data)
      }
    }
    ipcRenderer.on(CHANNELS.APPLICATION, listener)
  },
  subscribeToProfiles: (func: Callback) => {
    const listener: Listener = (_event, type, data) => {
      if (type === ACTIONS.SUBSCRIBE_PROFILES) {
        func(data)
      }
    }
    ipcRenderer.on(CHANNELS.APPLICATION, listener)
  },
}
