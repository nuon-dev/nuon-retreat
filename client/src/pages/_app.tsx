import { RecoilEnv, RecoilRoot } from "recoil"
import "../styles/globals.css"
import Head from "next/head"
import "./_app.css"
import Notification from "../components/notification/notification"
import { Stack } from "@mui/material"
import Script from "next/script"

function MyApp({ Component, pageProps }: any) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
  if (global.location) {
    var useragt = navigator.userAgent.toLowerCase()
    if (useragt.includes("kakao")) {
      global.location.href =
        "kakaotalk://web/openExternal?url=" +
        encodeURIComponent(
          `https://nuon.iubns.net/${global.location?.pathname}/`
        )
    }
  }

  var title = "새벽이슬"
  if (global.location?.pathname.includes("retreat")) {
    title = "2025 겨울 수련회"
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="referrer" content="same-origin" />
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta
          name="viewport"
          content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width"
        />
        <meta name="title" property="og:title" content={title} />
        <meta name="description" property="og:description" content="" />
        <meta name="image" property="og:image" content="/top.jpg" />
        <meta name="url" property="og:url" content="top.jpg" />
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
