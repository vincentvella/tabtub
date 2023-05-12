import React from 'react'
import { z, ZodError } from 'zod'
import Button, { ButtonProps } from '../components/button'
import { useActiveId } from '../context/active-id-context'

const contents = new Map<string, ButtonProps>([
  ['github', { icon: 'FaGithub', link: 'https://github.com' }],
  ['mail', { icon: 'Gmail', link: 'https://mail.google.com' }],
  [
    'calendar',
    {
      icon: 'FaCalendarAlt',
      link: 'https://accounts.google.com/v3/signin/identifier?dsh=S1611624178:1665765818620%20318&continue=https://calendar.google.com/calendar/r&followup=https://calendar.google.com/calendar/r&osid=1&passive=1209600&service=cl&flowName=GlifWebSignIn&flowEntry=ServiceLogin&ifkv=AQDHYWrL2lk0_Bcr1n1Y-f-i1sNZRKJK8CNisliX9rpozkqKhY2Jby8gsVZ_wDz_oHqiWmN6uZ6s6g',
    },
  ],
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
  const activeId = useActiveId()
  const sidebarContents = React.useMemo(() => contents, [])

  if (activeId !== 'add') {
    // This page should only be rendered when the activeId is 'add'
    return null
  }

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
