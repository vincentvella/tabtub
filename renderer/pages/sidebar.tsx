import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Chip from '../components/chip'
import AllIcons, { IconName } from '../icons'

type Tab = {
  id: string
  icon: IconName
  url: string
}

const SidebarButton = (props: Tab) => {
  const { icon, id } = props
  const callback = React.useCallback(() => window.api.changeTab(id), [id])
  const removeIcon = React.useCallback(() => window.api.removeTab(id), [id])
  return (
    <button onContextMenu={removeIcon} className="rounded-full" onClick={callback}>
      <Chip Icon={AllIcons[icon]} />
    </button>
  )
}

const AddTab: Tab = { id: 'add', icon: 'FaPlus', url: 'add' }

function Sidebar() {
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

  return (
    <React.Fragment>
      <div className="w-full bg-gray-700 min-h-screen pt-0.5">
        <ErrorBoundary FallbackComponent={null}>
          {tabs.map(({ icon, url, id }) => (
            <SidebarButton key={id} id={id} icon={icon} url={url} />
          ))}
        </ErrorBoundary>
      </div>
    </React.Fragment>
  )
}

export default Sidebar
