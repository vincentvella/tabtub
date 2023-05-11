import AddPage from '../components/add-page'
import ProfileSelector from '../components/profile-selector'
import Sidebar from '../components/sidebar'

const Application = () => {
  return (
    <div className="w-full h-full">
      <div className="flex-row flex">
        <Sidebar />
        <div className="w-full h-full">
          <ProfileSelector />
          <AddPage />
        </div>
      </div>
    </div>
  )
}

export default Application
