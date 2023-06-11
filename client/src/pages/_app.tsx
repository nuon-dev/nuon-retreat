import { RecoilRoot, useRecoilValue } from 'recoil'
import '../../styles/globals.css'
import Notification from 'components/notification/notification'
import { ShowNotification } from 'state/notification'

function MyApp({ Component, pageProps }: any) {
  return <>
    <RecoilRoot>
       <Notification />
      <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
      <Component {...pageProps} />
  </RecoilRoot>
  </>
}

export default MyApp
