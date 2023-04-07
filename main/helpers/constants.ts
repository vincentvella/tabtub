const isProd: boolean = process.env.NODE_ENV === 'production'
const PORT = process.argv[2]

const url = (path: string) => (isProd ? `app://./${path}.html` : `http://localhost:${PORT}/${path}`)

export const CONSTANTS = {
  headerHeight: 28,
  sidebarWidth: 56,
  isProd,
  PORT,
  SIDEBAR_URL: url('sidebar'),
  ADD_URL: url('add'),
  CONTEXT_MENU_URL: url('context-menu'),
}
