import React from 'react'
import { z, ZodError } from 'zod'
import Button, { ButtonProps } from '../components/button'

const contents = new Map<string, ButtonProps>([
  ['github', { icon: 'FaGithub', link: 'https://github.com' }],
  ['mail', { icon: 'Gmail', link: 'https://mail.google.com' }],
  ['calendar', { icon: 'FaCalendarAlt', link: 'https://calendar.google.com' }],
])

const url = z.string().url().min(1)

const TabCreator = () => {
  const [error, setError] = React.useState<string>('')
  const urlRef = React.useRef<HTMLInputElement>()

  const submit = React.useCallback<React.FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault()
    try {
      const validatedUrl = url.parse(urlRef.current.value)
      setError('')
      window?.api.addTab({ url: validatedUrl, icon: 'FaBeer' })
      // Store url persistently
      // Navigate user to new tab
    } catch (error) {
      if (error instanceof ZodError) {
        if (error.flatten().formErrors[0]) {
          setError(error.flatten().formErrors[0])
        }
      }
    }
  }, [])

  return (
    <>
      <form onSubmit={submit} className="flex flex-row">
        <input
          ref={urlRef}
          className="bg-indigo-900 text-xl p-2 w-full rounded-tl-xl rounded-bl-xl focus:outline-none"
          type="text"
          name="url"
        />
        <button type="submit" className="pl-4 pr-4 rounded-tr-xl rounded-br-xl bg-red-500">
          Submit
        </button>
      </form>
      <span className="pl-2 text-red-500">{error}</span>
    </>
  )
}

function AddPage() {
  const sidebarContents = React.useMemo(() => contents, [])
  return (
    <div className="pl-4 pr-4">
      <h1 className="text-3xl text-center pt-4 pb-4">Customize</h1>
      <div className="pb-4">
        <span className="pb-4">Enter a url of a new tab</span>
        <TabCreator />
      </div>
      <div className="pb-4">
        <span className="pb-4">Select an app from below to add to your tabs</span>
        <div className="grid grid-cols-4 gap-4">
          {Array.from(sidebarContents).map(([key, { icon, link }]) => (
            <Button key={key} icon={icon} link={link} text={key} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AddPage
