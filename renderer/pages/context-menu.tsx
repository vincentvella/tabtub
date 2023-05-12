import React from 'react'

type ContextMenuProps = {
  id: string
  type: 'tab' | 'profile'
}

function ContextMenu() {
  const [context, setContext] = React.useState<ContextMenuProps | undefined>()

  React.useEffect(() => {
    window?.api.getContextMenu().then((data: ContextMenuProps) => {
      setContext(data)
    })
  }, [])

  return (
    <div className="bg-slate-400 h-auto">
      <button
        className="pl-4 pr-4 cursor-pointer"
        onClick={() => {
          if (context?.type === 'profile') {
            window.api.removeProfile(context.id)
          } else if (context?.type === 'tab') {
            window.api.removeTab(context.id)
          }
          window.api.closeContextMenu()
        }}
      >
        <span>Delete</span>
      </button>
    </div>
  )
}

export default ContextMenu
