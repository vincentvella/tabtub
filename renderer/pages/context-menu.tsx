import React from 'react'

function ContextMenu() {
  const [id, setId] = React.useState<string | undefined>()

  React.useEffect(() => {
    window?.api.getContextMenu().then((data: string) => {
      setId(data)
    })
  }, [])

  return (
    <div className="bg-slate-400 h-auto">
      <button
        className="pl-4 pr-4 cursor-pointer"
        onClick={() => {
          window.api.removeTab(id)
          window.api.closeContextMenu()
        }}
      >
        <span>Delete</span>
      </button>
    </div>
  )
}

export default ContextMenu
