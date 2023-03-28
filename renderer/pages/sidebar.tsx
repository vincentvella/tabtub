import React from 'react'
import Chip, { ChipProps } from '../components/chip'
import { FaGithub, FaCalendarAlt, FaPlus } from 'react-icons/fa'
import Gmail from '../icons/gmail'
import AllIcons, { IconName } from '../icons'

type Tab = {
  id: string
  Icon: IconName
  link: string
}

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

const AddTab: Tab = { id: 'add', Icon: 'FaPlus', link: 'add' }

function Sidebar() {
  const [tabs, setTabs] = React.useState<Tab[]>([AddTab])

  React.useEffect(() => {
    if (window) {
      window.api.getTabs().then((data: string[]) => {
        console.log({ data })
        setTabs([AddTab, ...data.map((tab) => JSON.parse(tab) as Tab)])
      })
    }
  }, [])

  return (
    <React.Fragment>
      <div className="w-full bg-gray-700 min-h-screen pt-0.5">
        {tabs.map(({ Icon, link, id }) => (
          <SidebarButton key={id} Icon={AllIcons[Icon]} link={link} />
        ))}
      </div>
    </React.Fragment>
  )
}

export default Sidebar
