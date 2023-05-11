import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Profile } from '../../main/entities/store'
import { useActiveId } from '../context/active-id-context'
import { useProfiles } from '../hooks/useProfiles'

function ProfileSelector() {
  const activeId = useActiveId()
  const profiles = useProfiles(activeId)

  if (activeId === 'add') {
    // This page should only be rendered when the activeId is 'add'
    return null
  }

  return (
    <React.Fragment>
      <div className="w-full bg-gray-800 h-8">
        <ErrorBoundary FallbackComponent={null}>
          <div className="flex flex-row">
            {profiles.map((profile: Profile) => (
              <div key={profile.id} className="h-full flex items-center">
                <div className="hover:bg-gray-600">
                  <div className="pt-1 pb-1 pr-2 pl-2">
                    <span>{profile.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ErrorBoundary>
      </div>
    </React.Fragment>
  )
}

export default ProfileSelector
