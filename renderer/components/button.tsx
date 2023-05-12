import React from 'react'
import AllIcons, { IconName } from '../icons'
import Chip from './chip'

export interface ButtonProps {
  icon: IconName
  link: string
  text?: string
}

const Button: React.FC<ButtonProps> = ({ icon, link, text }) => {
  const callback = () => {
    window.api.addTab({ icon, url: link })
  }
  return (
    <button className="flex rounded-xl bg-indigo-900" onClick={callback}>
      <Chip Icon={AllIcons[icon]} />
      {!!text && <span className="self-center">{text}</span>}
    </button>
  )
}

export default Button
