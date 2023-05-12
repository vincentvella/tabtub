import { v4 as uuid } from 'uuid'
import Slice from 'electron-store'

class Store {
  public tabStorage = new TabStorage()
  public profileStorage = new ProfileStorage()
  constructor() {
    // Hydrate from storage
  }

  addTab(tab: Tab) {
    const id = this.tabStorage.set(tab)
    const profile = this.profileStorage.set({ name: 'Default', tabId: id })
    return { id, profile }
  }

  removeTab(id: string) {
    this.tabStorage.remove(id)
    this.profileStorage.removeByTabId(id)
  }
}

export type Tab = {
  id: string
  url: string
  icon: string
}

class TabStorage {
  store = new Slice<Record<string, Tab>>({ name: 'tabs' })

  set({ url, icon }: Omit<Tab, 'id'>) {
    const id = uuid()
    this.store.set(id, { url, icon })
    return id
  }

  get(id: string): Tab {
    return { ...this.store.get(id), id }
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
  id: string // pk
  tabId: string // fk
  name: string
}

class ProfileStorage {
  store = new Slice<Record<string, Profile>>({ name: 'profiles' })

  set({ name, tabId }: Omit<Profile, 'id'>) {
    const id = uuid()
    this.store.set(id, { name, tabId })
    return id
  }

  get(id: string): Profile {
    return { ...this.store.get(id), id }
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

  getByTabId(tabId: string) {
    return Object.entries(this.store.store as Record<string, Profile>)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }))
      .filter((profile) => profile.tabId === tabId)
  }

  updateProfile(id: string, name: string) {
    const profile = this.get(id)
    this.store.set(id, { ...profile, name })
  }

  removeByTabId(tabId: string) {
    this.getByTabId(tabId).forEach((profile) => this.remove(profile.id))
  }

  removeAll() {
    Object.keys(this.store.store).forEach((key) => this.remove(key))
  }
}

export default Store
