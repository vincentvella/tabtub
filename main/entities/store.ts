import { v4 as uuid } from 'uuid'
import Slice from 'electron-store'

class Store {
  public tabStorage = new TabStorage()
  public profileStorage = new ProfileStorage()
  constructor() {
    // Hydrate from storage
  }
}

export type Tab = {
  id: string
  url: string
  icon: string
}

class TabStorage {
  store = new Slice<Record<string, Tab>>()

  set({ url, icon }: Omit<Tab, 'id'>) {
    const id = uuid()
    this.store.set(id, { url, icon })
    return id
  }

  get(id: string): Tab {
    return {...this.store.get(id), id}
  }

  remove(id: string) {
    return this.store.delete(id)
  }

  getAll() {
    return Object.entries(this.store.store as Record<string, Tab>).map(([key, value]) => ({
      id: key,
      ...value,
    }))
  }
}

export type Profile = {
  tab: string
  name: string
}

class ProfileStorage {
  store = new Slice<Record<string, Profile>>()

  set({ name, tab }: Profile) {
    const id = uuid()
    this.store.set(id, { name, tab })
    return id
  }

  get(id: string): Profile {
    return this.store.get(id)
  }

  remove(id: string) {
    return this.store.delete(id)
  }

  getAll() {
    return Object.entries(this.store.store as Record<string, Profile>).map(([key, value]) => ({
      id: key,
      ...value,
    }))
  }
}

export default Store
