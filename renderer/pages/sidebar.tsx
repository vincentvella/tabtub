import React from 'react'
import Chip, { ChipProps } from '../components/chip'
import { FaGithub, FaCalendarAlt, FaPlus } from 'react-icons/fa'
import Gmail from '../icons/gmail'

const SidebarButton = (props: ChipProps) => {
  const { Icon, link } = props
  const callback = React.useCallback(() => {
    window.api.changeTab(link)
    // console.log('[LINK_CLICKED]' + link)
  }, [])
  return (
    <button className="rounded-full" onClick={callback}>
      <Chip Icon={Icon} link={link} />
    </button>
  )
}

const contents = new Map([
  ['add', { Icon: FaPlus, link: 'add' }],
  ['github', { Icon: FaGithub, link: 'https://github.com' }],
  ['mail', { Icon: Gmail, link: 'https://mail.google.com' }],
  ['calendar', { Icon: FaCalendarAlt, link: 'https://calendar.google.com' }],
])

function Sidebar() {
  const sidebarContents = React.useMemo(() => contents, [])

  React.useEffect(() => {
    if (window) {
      window.api.receiveTabs((...data) => {
        console.log(`Received data from main process`)
        console.log(data)
      })
      window.api.requestTabs()
      // setTimeout(() => {
      //   window.api.requestStorage()
      // }, 2000)
      // we are on the client process.
    }
  }, [])

  return (
    <React.Fragment>
      <div className="w-full bg-gray-700 min-h-screen pt-0.5">
        {Array.from(sidebarContents).map(([key, { Icon, link }]) => (
          <SidebarButton key={key} Icon={Icon} link={link} />
        ))}
      </div>
    </React.Fragment>
  )
}

export default Sidebar
