import React from 'react'
import Head from 'next/head'
import { FaCalendarAlt, FaGithub } from 'react-icons/fa'
import Gmail from '../icons/gmail'
import Button from '../components/button'

const contents = new Map([
  ['github', { Icon: FaGithub, link: 'https://github.com' }],
  ['mail', { Icon: Gmail, link: 'https://mail.google.com' }],
  ['calendar', { Icon: FaCalendarAlt, link: 'https://calendar.google.com' }],
])

function AppStore() {
  const sidebarContents = React.useMemo(() => contents, [])
  return (
    <div>
      <Head>
        <title> AppStore - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div className="pl-4 pr-4">
        <h1 className="text-3xl text-center pt-4 pb-4">Customize</h1>
        <span className="pb-4">
          Select an app from below to add to your tabs
        </span>
        <div className="grid grid-cols-4 gap-4">
          {Array.from(sidebarContents).map(([key, { Icon, link }]) => (
            <Button key={key} Icon={Icon} link={link} text={key} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AppStore
