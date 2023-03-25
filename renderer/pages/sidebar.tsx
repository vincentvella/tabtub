import React from 'react'
import Chip, { ChipProps } from '../components/chip'
import { FaGithub, FaCalendarAlt, FaPlus } from 'react-icons/fa'
import Gmail from '../icons/gmail'

const SidebarButton = (props: ChipProps) => {
  const { Icon, link } = props
  const callback = React.useCallback(() => {
    console.log('[LINK_CLICKED]' + link)
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
