import React from 'react'
import { Profile } from '../../main/entities/store'

export function useProfiles(activeId: string) {
  const [profiles, setProfiles] = React.useState([])

  React.useEffect(() => {
    // Get Tabs from Electron
    window?.api.getProfiles(activeId).then((profiles: Profile[]) => {
      setProfiles(profiles)
    })
  }, [activeId])

  React.useEffect(() => {
    window?.api.subscribeToProfiles((data) => {
      setProfiles(data)
    })
  }, [])

  return profiles
}
