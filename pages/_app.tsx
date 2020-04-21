import { AppProps } from "next/app"
import Head from "next/head"
import "../styles/index.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
