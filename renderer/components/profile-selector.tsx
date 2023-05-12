import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Profile } from '../../main/entities/store'
import { useActiveId } from '../context/active-id-context'
import { useProfiles } from '../hooks/useProfiles'

const ProfileNode = ({ profile }: { profile: Profile }) => {
  const [isEditable, setIsEditable] = React.useState(false)
  const newValue = React.useRef('')

  React.useEffect(() => {
    if (isEditable) {
      const element = document.getElementById(`${profile.id}`)
      element?.focus()
      element.addEventListener('keypress', (evt) => {
        // Prevent enter from being pressed in non-deprecated fashion
        if (evt.key === 'Enter') {
          evt.preventDefault()
          element?.blur()
        }
      })
    }
  }, [isEditable])

  const openContextMenu = React.useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
    const element = e.target as HTMLElement
    const position = element.getBoundingClientRect()
    window.api.openContextMenu(profile.id, 'profile', {
      x: position.x,
      y: position.bottom + position.height + position.height,
    })
  }, [])

  return (
    <button
      onContextMenu={openContextMenu}
      onClick={() => {
        window?.api.changeProfile(profile.id)
      }}
      onDoubleClick={() => {
        setIsEditable(true)
      }}
      key={profile.id}
      className="h-full flex items-center"
    >
      <div className="hover:bg-gray-600">
        <div
          suppressContentEditableWarning
          id={`${profile.id}`}
          contentEditable={isEditable}
          onBlur={() => {
            setIsEditable(false)
            if (newValue.current) {
              window?.api.updateProfile(profile.id, newValue.current)
            }
          }}
          onInput={(e) => (newValue.current = e.currentTarget.textContent || '')}
          className="pt-1 pb-1 pr-2 pl-2 outline-none select-none"
        >
          <span>{profile.name}</span>
        </div>
      </div>
    </button>
  )
}

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
              <ProfileNode profile={profile} key={profile.id} />
            ))}
            <div>
              <button
                onClick={() => {
                  window?.api.addProfile()
                }}
                className="h-full flex items-center"
              >
                <div className="hover:bg-gray-600">
                  <div className="pt-1 pb-1 pr-2 pl-2">
                    <span>+</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </React.Fragment>
  )
}

export default ProfileSelector
