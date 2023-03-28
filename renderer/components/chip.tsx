import React, { useCallback } from 'react'
import { IconType } from 'react-icons/lib'

export interface ChipProps {
  Icon: IconType
}

const Chip: React.FC<ChipProps> = ({ Icon }) => (
  <div className="text-2xl flex rounded-full bg-red-500 m-2 p-2 justify-center w-10 h-10">
    <Icon className="pointer-events-none" />
  </div>
)

export default Chip
