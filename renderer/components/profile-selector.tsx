import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Profile } from '../../main/entities/store'

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
