import { v4 as uuid } from 'uuid'

const LOCAL_STORAGE_KEY = '[URL]'

class UrlStorage {
	constructor() {
		// Hydrate from storage
	}
	set(url: string) {
		const key = uuid()
		localStorage.setItem(`${LOCAL_STORAGE_KEY}${key}`, url)
	}
	get(key: string) {
		localStorage.getItem(`${LOCAL_STORAGE_KEY}${key}`)
	}
	getAll() {
		const keys = {}
		for (let key in localStorage) {
			if (key.startsWith(LOCAL_STORAGE_KEY) && localStorage.hasOwnProperty(key)) {
				keys[key] = localStorage[key]
			}
		}
		console.log(keys)
		return keys
	}
}

export default UrlStorage