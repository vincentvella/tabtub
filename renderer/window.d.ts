import type { Api } from '../main/api'
declare global {
	interface Window { api: Api; }
}
export { }