import '../../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <>
    <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
    <Component {...pageProps} />
  </>
}

export default MyApp
