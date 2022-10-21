import React from "react";
import Html5QrcodePlugin from "./components/Html5QrcodePlugin";
import ReactModal from "react-modal";
import Link from "next/link";
import axios from "axios";

const urlApi = process.env.API_URL;
class QRcodePage extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback.
    this.onNewScanResult = this.onNewScanResult.bind(this);
    this.state = {
      showModal: false,
      urlRoute: "",
      idRoute: "",
      nameRoute: "",
      description: "",
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
  nameRoute(name) {
    this.setState({ nameRoute: name });
  }
  description(des) {
    this.setState({ description: des });
  }
  idRoute(id) {
    this.setState({ idRoute: id });
  }

  render() {
    return (
      <div>
        <h1>Guia itesa</h1>
        <Html5QrcodePlugin
          fps={30}
          qrbox={500}
          disableFlip={true}
          qrCodeSuccessCallback={this.onNewScanResult}
        />
        <ReactModal isOpen={this.state.showModal} contentLabel="Ruta a seguir">
          <div
            style={{
              color: "black",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1>¿Quieres acceder a esta ruta?</h1>
            <h2>{this.state.nameRoute}</h2>
            <p>{this.state.description}</p>
            <div
              style={{
                width: "100%",
                backgroundColor: "#00B399",
                marginTop: "30px",
                borderRadius: "10px",
                textAlign: "center",
                padding: "10px 0px",
                color: "white",
              }}
            >
              <Link
                href={
                  urlGuiaEscolarLocal + "?id=" + this.state.idRoute + "&pc=1"
                }
              >
                Ir a ruta
              </Link>
            </div>
            <div
              style={{
                width: "100%",
                backgroundColor: "#AA2222",
                marginTop: "30px",
                borderRadius: "10px",
                textAlign: "center",
                padding: "10px 0px",
                color: "white",
              }}
            >
              <p onClick={this.handleCloseModal}>No</p>
            </div>
          </div>
        </ReactModal>
      </div>
    );
  }

  onNewScanResult(decodedText, decodedResult) {
    // Handle the result here.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    let finalURL = decodedText;
    //hacer petición a la base de datos para ver si existe la ruta
    axios
      .get(urlApi + "/admin/rutas/" + finalURL)
      .then((res) => {
        console.log("id de ruta:" + res.data.id);
        if (res.status === 200) {
          this.handleOpenModal();
          this.urlRefRoute(finalURL);
          this.nameRoute(res.data.propiedades.nombre);
          this.idRoute(res.data.id);
          this.description(res.data.propiedades.descripcion);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("No existe la ruta" + err);
      });
  }
}
//Export the page
export default QRcodePage;
