const isProd: boolean = process.env.NODE_ENV === 'production'
const PORT = process.argv[2]

export const CONSTANTS = {
	headerHeight: 28,
	sidebarWidth: 56,
	isProd,
	PORT,
	SIDEBAR_URL: isProd
		? 'app://./sidebar.html'
		: `http://localhost:${PORT}/sidebar`,
	ADD_URL: isProd ? 'app://./add.html' : `http://localhost:${PORT}/add`,
}
