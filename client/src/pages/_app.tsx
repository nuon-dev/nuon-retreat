import { RecoilEnv, RecoilRoot } from "recoil"
import "../../styles/globals.css"
import Head from "next/head"
import "./_app.css"
import Notification from "components/notification/notification"
import { Stack } from "@mui/material"
import Script from "next/script"

function MyApp({ Component, pageProps }: any) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

  return (
    <>
      <Head>
        <title>2024 새벽이슬 하계 수련회</title>
        <meta name="referrer" content="same-origin" />
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta
          name="viewport"
          content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width"
        />
        <meta
          name="title"
          property="og:title"
          content="2024 새벽이슬 하계 수련회"
        />
        <meta
          name="description"
          property="og:description"
          content="너는 물 댄 동산 같겠고 &lt; 사 58 : 11 &gt;"
        />
        <meta name="image" property="og:image" content="/bg_1.jpeg" />
        <meta name="url" property="og:url" content="bg_1.jpeg" />
      </Head>
      <RecoilRoot>
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
          onReady={() => {
            const globalValue: any = global
            var Kakao: any = globalValue.Kakao
            if (Kakao && !Kakao.isInitialized()) {
              Kakao.init("24c68e47fc07af3735433d60a3c4f4b3") //발급받은 키 중 javascript키를 사용해준다.
            }
          }}
        />
        <Notification />
        <Stack fontFamily="PretendardVariable">
          <Component {...pageProps} />
        </Stack>
      </RecoilRoot>
    </>
  )
}

export default MyApp
