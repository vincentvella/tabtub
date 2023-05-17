import { platformSelect } from './platform'

const isProd: boolean = process.env.NODE_ENV === 'production'
const PORT = process.argv[2]

const url = (path: string) =>
  isProd ? `https://tabtub.vercel.app/${path}.html` : `http://localhost:${PORT}/${path}`

export const CONSTANTS = {
  headerHeight: platformSelect({ mac: 28, windows: 0, linux: 0 }),
  extraHeight: platformSelect({ windows: -58, mac: 0, linux: 0 }),
  extraWidth: platformSelect({ windows: -16, mac: 0, linux: 0 }),
  profileSelectorHeight: 32,
  sidebarWidth: 56,
  isProd,
  PORT,
  APPLICATION_URL: url('application'),
  CONTEXT_MENU_URL: url('context-menu'),
}
