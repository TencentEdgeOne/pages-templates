// pages/_app.jsx

export default function App({ Component, pageProps }) {
  return (
    <div suppressHydrationWarning>
      <Component {...pageProps} />
    </div>
  )
}