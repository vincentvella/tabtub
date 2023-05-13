import React, { PropsWithChildren } from 'react'
import Icons from '../icons'
import { FaUpload } from 'react-icons/fa'

const options = ['Select', 'Upload'] as const
type Option = Lowercase<(typeof options)[number]>

type IconSelectorProps = {
  onSubmit: (icon: string) => void
  onCancel: () => void
}

const IconSelector: React.FC<IconSelectorProps> = ({ onCancel, onSubmit }) => {
  const [mode, setMode] = React.useState<Option>('select')
  const [selectedIcon, setSelectedIcon] = React.useState<string | null>(null)
  const [iconSet, setIconSet] = React.useState(Object.entries(Icons))

  const filterIcons = (filter: string) => {
    if (!filter) {
      setIconSet(Object.entries(Icons))
      return
    }
    setIconSet(
      Object.entries(Icons).filter(([key, value]) => {
        return key.toLowerCase().includes(filter.toLowerCase())
      })
    )
  }

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-gray-900 px-4 m-4 min-h-500 max-h-500">
              <h3 className="font-semibold leading-6 text-gray-200 text-2xl" id="modal-title">
                Select an Icon
              </h3>
              <hr className="w-full mt-2 mb-2" />
              <div>
                <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                  {options.map((option, index) => (
                    <li className="w-full">
                      <button
                        role="button"
                        onClick={() => setMode(option.toLowerCase() as Option)}
                        data-active={`${option.toLowerCase() === mode}`}
                        className={`
                        inline-block w-full p-2 focus:outline-none
                        ${index === 0 ? 'rounded-l-lg' : ''}
                        ${index + 1 === options.length ? 'rounded-r-lg' : ''} 
                        data-inactive:bg-white data-inactive:hover:text-gray-700 data-inactive:hover:bg-gray-50  data-inactive:dark:hover:text-white data-inactive:dark:bg-gray-800 data-inactive:dark:hover:bg-gray-700
                        data-active:text-gray-900 data-active:bg-gray-100 data-active:dark:bg-gray-700 data-active:dark:text-white
                        `}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Active Panel based on the above selection */}
              {mode === 'select' && (
                <>
                  {/* // Text input to filter below icons */}
                  <input
                    onChange={(e) => filterIcons(e.target.value)}
                    type="text"
                    placeholder="Filter"
                    className="w-full px-3 py-2 mb-2 text-sm leading-tight bg-gray-800 text-gray-200 border rounded-lg border-none shadow appearance-none focus:outline-none focus:shadow-outline mt-2"
                  />
                  <div className="max-h-96 overflow-x-hidden overflow-y-scroll scrollbar-thumb-gray-400 scrollbar-track-gray-600 scrollbar-thin pr-2 -mr-4">
                    <>
                      {/* // list of all icons */}
                      <div className="grid grid-cols-3 gap-4">
                        {iconSet.map(([key, Icon]) => (
                          <button
                            role="button"
                            onClick={() => setSelectedIcon(selectedIcon === key ? null : key)}
                            data-active={`${selectedIcon === key}`}
                            className="flex flex-col items-center data-active:bg-gray-700 data-active:rounded-lg data-active:shadow-lg data-active:border-transparent data-active:border-2 data-active:border-gray-100 data-active:dark:border-gray-700 data-active:dark:bg-gray-800 data-active:dark:text-white data-inactive:border-2 data-inactive:border-transparent"
                          >
                            <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-gray-800">
                              <Icon size={24} />
                            </div>
                            <div className="text-sm text-gray-200">
                              {key.slice(0, 16)}
                              {key.length > 16 && '...'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  </div>
                </>
              )}
              {mode === 'upload' && (
                // TODO: Implement upload
                <div className="mt-6 flex flex-col items-center justify-center min-h-400 border-dashed border-gray-200 border">
                  <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-gray-800">
                    <FaUpload size={24} />
                  </div>
                  <div className="text-sm text-gray-200">Upload coming soon...</div>
                </div>
              )}
            </div>
            <div className="bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={() => {
                  if (selectedIcon) {
                    onSubmit(selectedIcon)
                  }
                }}
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 sm:ml-3 sm:w-auto"
              >
                Submit
              </button>
              <button
                onClick={onCancel}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-800 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IconSelector
