import { v4 as uuid } from 'uuid'
import Slice from 'electron-store'


class Store {
	public tabStorage = new TabStorage()
	constructor() {
		// Hydrate from storage
	}
}

export type Tab = {
	url: string,
	icon: string
}

class TabStorage {
	store = new Slice<Record<string, Tab>>()

	set({ url, icon }: Tab) {
		const id = uuid()
		this.store.set(id, { url, icon })
		return id
	}

	get(id: string): Tab {
		return this.store.get(id)
	}

	getAll() {
		return Object.entries(this.store.store as Record<string, Tab>).map(([key, value]) => ({ id: key, ...value }))
	}
}

export default Store 