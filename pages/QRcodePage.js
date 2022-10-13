import React from "react";
import Html5QrcodePlugin from "./components/Html5QrcodePlugin";
import ReactModal from "react-modal";
import Link from "next/link";

class QRcodePage extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback.
    this.onNewScanResult = this.onNewScanResult.bind(this);
    this.state = {
      showModal: false,
      urlRoute: "",
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.urlRefRoute = this.urlRefRoute.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  urlRefRoute(newRoute) {
    this.setState({ urlRoute: newRoute });
  }

  render() {
    return (
      <div>
        <h1>Guia itesa</h1>
        <Html5QrcodePlugin
          fps={10}
          qrbox={250}
          disableFlip={true}
          qrCodeSuccessCallback={this.onNewScanResult}
        />
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
        >
          <h1>Guia itesa</h1>
          <p>Quieres acceder a esta ruta?</p>
          <Link href={this.state.urlRoute}>
            <a>Ir a ruta</a>
          </Link>
          <button onClick={this.handleCloseModal}>No</button>
        </ReactModal>
      </div>
    );
  }

  onNewScanResult(decodedText, decodedResult) {
    // Handle the result here.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    let finalURL = "http://" + decodedText;
    this.urlRefRoute(finalURL);
    console.log(this.state.urlRoute);
    this.handleOpenModal();
  }
}
//Export the page
export default QRcodePage;
