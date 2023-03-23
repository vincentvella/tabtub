import React from 'react'
import { IconType } from 'react-icons/lib'
import Chip, { ChipProps } from './chip'

interface ButtonProps extends ChipProps {
  Icon: IconType
  link: string
  text?: string
}

const Button: React.FC<ButtonProps> = ({ Icon, link, text }) => {
  const callback = () => {
    console.log('[LINK_CLICKED]' + link)
  }
  return (
    <button className="flex rounded-xl bg-indigo-900">
      <Chip link={link} Icon={Icon} />
      {!!text && <span className="self-center">{text}</span>}
    </button>
  )
}

export default Button
