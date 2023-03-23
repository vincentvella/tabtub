import React from 'react'
import Head from 'next/head'
import { FaBeer, FaCalendarAlt, FaGithub } from 'react-icons/fa'
import Gmail from '../icons/gmail'
import Chip from '../components/chip'
import Button from '../components/button'

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

function AppStore() {
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
      <Head>
        <title> AppStore - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div className="pl-4 pr-4">
        <h1 className="text-3xl text-center pt-4 pb-4">App Store</h1>
        <span className="pb-4">
          Select an app from below to add to your tabs
        </span>
        <div className="grid grid-cols-4 gap-4">
          {Array.from(sidebarContents).map(([key, { Icon, link }]) => (
            <Button Icon={Icon} link={link} text={key} />
          ))}
        </div>
      </div>
    </React.Fragment>
  )
}

export default AppStore
