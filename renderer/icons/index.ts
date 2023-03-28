import * as Icons from 'react-icons/fa'
import Gmail from './gmail'

const AllIcons = {
	...Icons,
	Gmail,
}

export type IconName = keyof typeof AllIcons

export default AllIcons