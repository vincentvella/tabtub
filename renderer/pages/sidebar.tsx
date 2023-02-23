import React from 'react'
import Head from 'next/head'

const Link = ({ link }) => {
  const callback = () => {
    console.log('[LINK_CLICKED]' + link)
  }
  return (
    <button onClick={callback}>
      <span className="text-white">About</span>
    </button>
  )
}

function Home() {
  return (
    <React.Fragment>
      <div></div>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        {['', 'https://mail.google.com', 'https://github.com'].map(
          (link, i) => (
            <div key={i} className="mt-1 w-full flex-wrap flex justify-center">
              <Link link={link} />
            </div>
          )
        )}
      </div>
    </React.Fragment>
  )
}

export default Home
