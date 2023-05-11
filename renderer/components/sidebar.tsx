import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Chip from './chip'
import AllIcons, { IconName } from '../icons'
import { useTabs } from '../hooks/useTabs'

type Tab = {
  id: string
  icon: IconName
  url: string
}

const SidebarButton = (props: Tab) => {
  const { icon, id } = props
  const callback = React.useCallback(() => window.api.changeTab(id), [id])
  const removeIcon = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    const element = e.target as HTMLElement
    const position = element.getBoundingClientRect()
    if (id === 'add') {
      window.api.closeContextMenu()
    } else {
      window.api.openContextMenu(id, {
        x: position.x + position.width,
        y: position.y + position.height,
      })
    }
  }, [])
  return (
    <button onContextMenu={removeIcon} className="rounded-full" onClick={callback}>
      <Chip Icon={AllIcons[icon]} />
    </button>
  )
}

const AddTab: Tab = { id: 'add', icon: 'FaPlus', url: 'add' }

function Sidebar() {
  const tabs = useTabs()

  return (
    <React.Fragment>
      <div
        // Close context menu if user clicks elsewhere
        onClick={() => window.api.closeContextMenu()}
        className="w-14 bg-gray-700 min-h-screen pt-0.5"
      >
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
