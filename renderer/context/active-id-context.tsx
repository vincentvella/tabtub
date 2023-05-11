import React from 'react'

const ActiveIdContext = React.createContext<string>(undefined)

export const ActiveIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeId, setActiveId] = React.useState<string>('add')

  React.useEffect(() => {
    window?.api.subscribeToActiveTab((data) => {
      setActiveId(data)
    })
  }, [])

  return <ActiveIdContext.Provider value={activeId}>{children}</ActiveIdContext.Provider>
}

export const useActiveId = () => {
  const context = React.useContext(ActiveIdContext)
  if (context === undefined) {
    throw new Error('useActiveId must be used within a ActiveIdProvider')
  }
  return context
}
