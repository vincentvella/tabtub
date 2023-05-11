import React from 'react'
import type { AppProps } from 'next/app'

import '../styles/globals.css'
import { ActiveIdProvider } from '../context/active-id-context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ActiveIdProvider>
      <Component {...pageProps} />
    </ActiveIdProvider>
  )
}

export default MyApp
