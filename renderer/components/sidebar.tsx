import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Chip from './chip'
import AllIcons, { IconName } from '../icons'
import { useTabs } from '../hooks/useTabs'
import { useActiveId } from '../context/active-id-context'

type Tab = {
  id: string
  icon: IconName
  url: string
}

const SidebarButton = (props: Tab) => {
  const { icon, id } = props
  const activeId = useActiveId()
  const callback = React.useCallback(() => {
    if (id !== activeId) {
      window.api.changeTab(id)
    }
  }, [id, activeId])
  const removeIcon = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    const element = e.target as HTMLElement
    const position = element.getBoundingClientRect()
    if (id === 'add') {
      window.api.closeContextMenu()
    } else {
      window.api.openContextMenu(id, 'tab', {
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
