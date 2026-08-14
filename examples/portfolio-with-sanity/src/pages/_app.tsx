import './globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>设计师作品集 | 红黑主题 | EdgeOne Makers</title>
        <meta name="description" content="专业设计师作品集展示，采用红黑色调主题 · Demo only · EdgeOne Makers" />
        <meta name="keywords" content="EdgeOne Makers, Demo only" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}