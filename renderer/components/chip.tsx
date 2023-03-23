import React from 'react'
import { IconType } from 'react-icons/lib'

export interface ChipProps {
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
      className="text-2xl flex rounded-full bg-red-500 m-2 p-2 justify-center w-10 h-10"
    >
      <Icon className="pointer-events-none" />
    </button>
  )
}

export default Chip
