import "./_app.css"
import Head from "next/head"
import "../styles/globals.css"
import Script from "next/script"
import { Stack } from "@mui/material"
import { RecoilEnv, RecoilRoot } from "recoil"
import Notification from "../components/notification/notification"

function MyApp({ Component, pageProps }: any) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
  let isKakaoBrowser = false
  if (global.location) {
    var useragt = navigator.userAgent.toLowerCase()
    if (useragt.includes("kakao")) {
      global.location.href =
        "kakaotalk://web/openExternal?url=" +
        encodeURIComponent(`https://nuon.iubns.net${global.location?.pathname}`)
      isKakaoBrowser = true
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
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta
          name="viewport"
          content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width"
        />

        <meta name="title" property="og:title" content={title} />
        <meta name="description" property="og:description" content="" />
        <meta name="image" property="og:image" content="/retreat_bg.jpg" />
        <meta name="url" property="og:url" content="retreat_bg.jpg" />
        <meta name="format-detection" content="telephone=no" />
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
        <Stack
          width="100%"
          height="100%"
          //fontFamily="PretendardVariable" // 편지 로딩 시간 줄이기 위해, 사용하지 않는 폰트 임시 주석
        >
          {isKakaoBrowser ? (
            <div>카카오톡 브라우저에서는 사용할 수 없습니다.</div>
          ) : (
            <Component {...pageProps} />
          )}
        </Stack>
      </RecoilRoot>
    </>
  )
}

export default MyApp
