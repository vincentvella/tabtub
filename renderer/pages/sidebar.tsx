import React from 'react'
import Chip from '../components/chip'
import { FaBeer, FaGithub, FaCalendarAlt } from 'react-icons/fa'
import Gmail from '../icons/gmail'

const Link = ({ link }) => {
  const callback = () => {
    console.log('[LINK_CLICKED]' + link)
  }
  return (
    <button onClick={callback}>
      <span className="text-white">About</span>
    </button>
  )
}

function Sidebar() {
  const sidebarContents = React.useMemo(() => {
    return new Map([
      ['beer', { Icon: FaBeer, link: 'app-store' }],
      ['github', { Icon: FaGithub, link: 'https://github.com' }],
      ['mail', { Icon: Gmail, link: 'https://mail.google.com' }],
      [
        'calendar',
        { Icon: FaCalendarAlt, link: 'https://calendar.google.com' },
      ],
    ])
  }, [])
  return (
    <React.Fragment>
      <div className="w-full">
        {Array.from(sidebarContents).map(([key, { Icon, link }]) => (
          <Chip key={key} Icon={Icon} link={link} />
        ))}
      </div>
    </React.Fragment>
  )
}

export default Sidebar
