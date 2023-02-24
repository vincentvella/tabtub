const isProd: boolean = process.env.NODE_ENV === 'production'
const PORT = process.argv[2]

export const CONSTANTS = {
  headerHeight: 28,
  sidebarWidth: 100,
  isProd,
  PORT,
  SIDEBAR_URL: isProd
    ? 'app://./sidebar.html'
    : `http://localhost:${PORT}/sidebar`,
  APPSTORE_URL: isProd
    ? 'app://./app-store.html'
    : `http://localhost:${PORT}/app-store`,
}
