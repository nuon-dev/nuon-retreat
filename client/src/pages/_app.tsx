import { RecoilEnv, RecoilRoot } from "recoil"
import "../../styles/globals.css"
import Head from "next/head"
import Notification from "components/notification/notification"

function MyApp({ Component, pageProps }: any) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
  return (
    <>
      <Head>
        <meta name="title" property="og:title" content="태신자 작정" />
        <meta
          name="description"
          property="og:description"
          content="태신자 작정"
        />
        {/*<meta name="image" property="og:image" content="%PUBLIC_URL%/logo.png" />
      <meta name="url" property="og:url" content="" />*/}
      </Head>
      <RecoilRoot>
        <Notification />
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  )
}

export default MyApp
