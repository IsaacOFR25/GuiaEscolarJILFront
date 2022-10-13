import "../styles/globals.css";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  <div>
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    ></meta>
    //Script for qr code scanner
    <script src="html5-qrcode.min.js"></script>; //Script for Aumented reality
    (AR)
    <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <script src="https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-detector.js"></script>
    <script src="https://raw.githack.com/AR-js-org/studio-backend/master/src/modules/marker/tools/gesture-handler.js"></script>
  </div>;
  return <Component {...pageProps} />;
}

export default MyApp;
