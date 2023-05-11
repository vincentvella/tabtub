import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Profile } from '../../main/entities/store'
import { useActiveId } from '../context/active-id-context'

function ProfileSelector() {
  const [profiles, setProfiles] = React.useState([])

  React.useEffect(() => {
    // Get Tabs from Electron
    window?.api.getProfiles().then((profiles: Profile[]) => {
      setProfiles(profiles)
    })
  }, [])

  React.useEffect(() => {
    // window?.api.subscribeToProfiles((data) => {
    //   setProfiles(data)
    // })
  }, [])

  const activeId = useActiveId()

  if (activeId === 'add') {
    // This page should only be rendered when the activeId is 'add'
    return null
  }

  return (
    <React.Fragment>
      <div className="w-full bg-gray-800 h-8">
        <ErrorBoundary FallbackComponent={null}>
          <div className="h-full flex items-center">
            <div className="hover:bg-gray-600">
              <div className="pt-1 pb-1 pr-2 pl-2">
                <span>hey</span>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </React.Fragment>
  )
}

export default ProfileSelector
