import React from 'react'
import { IconName } from '../icons'

type Tab = {
  id: string
  icon: IconName
  url: string
}

const AddTab: Tab = { id: 'add', icon: 'FaPlus', url: 'add' }

export function useTabs() {
  const [tabs, setTabs] = React.useState<Tab[]>([AddTab])

  React.useEffect(() => {
    // Get Tabs from Electron
    window?.api.getTabs().then((data: Tab[]) => {
      setTabs([AddTab, ...data])
    })
  }, [])

  React.useEffect(() => {
    window?.api.subscribeToTabs((data) => {
      setTabs([AddTab, ...data])
    })
  }, [])

  return tabs
}
