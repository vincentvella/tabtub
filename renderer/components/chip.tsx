import Link from 'next/link'
import React, { PropsWithChildren } from 'react'
import { FaBeer } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

type ChipProps = {
  Icon: IconType
  link: string
}

const Chip: React.FC<ChipProps> = ({ Icon, link }) => {
  const callback = () => {
    console.log('[LINK_CLICKED]' + link)
  }
  return (
    <button
      onClick={callback}
      className="flex rounded-full bg-red-500 m-2 p-2 justify-center w-10 h-10"
    >
      <Icon className="pointer-events-none" />
    </button>
  )
}

export default Chip
