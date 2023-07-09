import { RecoilEnv, RecoilRoot } from 'recoil'
import '../../styles/globals.css'
import Notification from 'components/notification/notification'

function MyApp({ Component, pageProps }: any) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
  return <>
    <RecoilRoot>
      <Notification />
      <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
      <Component {...pageProps} />
  </RecoilRoot>
  </>
}

export default MyApp
