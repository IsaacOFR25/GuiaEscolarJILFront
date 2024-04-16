import React from "react";
import axios from "axios";
import Link from "next/link";
import styles from "../styles/gestorRutasTarjetas.module.css";
import { AiOutlineArrowLeft, AiFillEye } from "react-icons/ai";
import { Snackbar } from "@mui/material";

const urlApi = process.env.NEXT_PUBLIC_API_URL;

export default function GeneradorRutas() {
  const [tarjetas, setTarjetas] = React.useState(null);
  const [rutas, setRutas] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [mensaje, setMensaje] = React.useState("");
  const actualizarTarjetas = () => {
    axios
      .get(urlApi + "/admin/tarjetas")
      .then((res) => {
        setTarjetas(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(urlApi + "/admin/rutas").then((res) => {
      setRutas(res.data);
    });
  };

  React.useEffect(() => {
    actualizarTarjetas();
  }, []);

  const borrarTarjeta = (id, e) => {
    console.log("Tarjeta a borrar " + id);
    //aletra para confirmar si se desea borrar la tarjeta
    if (window.confirm("¿Desea borrar la tarjeta?")) {
      axios
        .delete(urlApi + "/admin/tarjetas/eliminar/" + id)
        .then((res) => {
          actualizarTarjetas();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const borrarRuta = (id, e) => {
    console.log("Ruta a borrar " + id);
    //aletra para confirmar si se desea borrar la tarjeta
    if (window.confirm("¿Desea borrar la ruta?")) {
      axios
        .delete(urlApi + "/admin/rutas/eliminar/" + id)
        .then((res) => {
          actualizarTarjetas();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const accionarTarjeta = (id) => {
    axios
      .get(urlApi + "/tarjeta/" + id + "/on")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setOpen(true);
    setMensaje("Tarjeta " + id + " activada");
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <div
        className="header"
        style={{
          padding: "0 20px",
          width: "100vw",
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#00B399",
          color: "#fff",
        }}
      >
        <Link href="/">
          <div>
            <AiOutlineArrowLeft
              style={{ width: "40px", height: "30px", paddingRight: "10px" }}
            />
          </div>
        </Link>
        <h3>Administrador</h3>
        <a href={urlApi + "/mostrarRutas"}>
          <AiFillEye
            style={{ width: "30px", height: "30px", paddingLefth: "10px" }}
          />
        </a>
      </div>
      <Snackbar open={open} message={mensaje} />
      <p>
        Esta pagina genera las rutas para la app, tambien puedes agregar nuevas
        tarjetas para apliar tus rutas
      </p>
      <div className={styles.stackLayout}>
        <h2>Tus tarjetas disponibles</h2>
        <div>
          {tarjetas ? (
            tarjetas.map((tarjeta) => {
              //Si no hay tarjetas disponibles se muestra un mensaje
              console.error(tarjetas.length);
              if (tarjeta == null) {
                return <p>No hay tarjetas disponibles</p>;
              } else {
                return (
                  <div
                    className={styles.tarjeta}
                    id={tarjeta.id}
                    key={tarjeta.id}
                    onClick={() => accionarTarjeta(tarjeta.id)}
                  >
                    <div className={styles.tarjetaCabeza}>
                      <h3>Nombre: {tarjeta.propiedades.nombre}</h3>
                      <p>ID: {tarjeta.id}</p>
                    </div>
                    <div className={styles.tarjetaPie}>
                      <div className={styles.tarjetaPieIZ}>
                        <p>{tarjeta.propiedades.modelo}</p>
                        {/* <button
                          onClick={(e) =>
                            generarCodigo(tarjeta.propiedades.modelo)
                          }
                        >
                          codigo
                        </button> */}
                      </div>
                      <div className={styles.tarjetaPieDE}>
                        <button
                          key={tarjeta.id}
                          onClick={(e) => borrarTarjeta(tarjeta.id, e)}
                          style={{
                            boxShadow: "inset 0px 1px 0px 0px #f29c93",
                            background:
                              "linear-gradient(to bottom, #fe1a00 5%, #ce0100 100%)",
                            backgroundColor: "#fe1a00",
                            borderRadius: "6px",
                            border: "1px solid #d83526",
                            display: "inline-block",
                            cursor: "pointer",
                            color: "#ffffff",
                            fontFamily: "Arial",
                            fontSize: "15px",
                            fontWeight: "bold",
                            padding: "6px 24px",
                            textDecoration: "none",
                            textShadow: "0px 1px 0px #b23e35",
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <p>Cargando...</p>
          )}

          <Link href="./agregarTarjeta">
            <div
              className={styles.button}
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
              Agregar Tarjeta
            </div>
          </Link>
        </div>
        <h2>Tus rutas</h2>
        <div className="rutas">
          {rutas ? (
            rutas.map((ruta) => {
              return (
                <div className={styles.tarjeta} id={ruta.id} key={ruta.id}>
                  <div className={styles.tarjetaCabeza}>
                    <h3>Nombre: {ruta.propiedades.nombre}</h3>
                    <p># Puntos: {ruta.propiedades.numeroPuntos}</p>
                  </div>
                  <div className={styles.tarjetaCabeza}>
                    <p>Description: {ruta.propiedades.descripcion}</p>
                    <p>Identificador: {ruta.id}</p>
                  </div>
                  <div className={styles.tarjetaCabeza}>
                    {/* Peticion get para generar un QR con la api, le envia el string: "ruta"+ruta.id */}
                    <a
                      href={urlApi + "/generadorQR/" + ruta.id}
                      download="true"
                    >
                      <button
                        style={{
                          boxShadow: "inset 0px 1px 0px 0px #3dc21b",
                          background:
                            "linear-gradient(to bottom, #44c767 5%, #5cbf2a 100%)",
                          backgroundColor: "#44c767",
                          borderRadius: "6px",
                          border: "1px solid #18ab29",
                          display: "inline-block",
                          cursor: "pointer",
                          color: "#ffffff",
                          fontFamily: "Arial",
                          fontSize: "15px",
                          fontWeight: "bold",
                          padding: "6px 24px",
                          textDecoration: "none",
                          textShadow: "0px 1px 0px #2f6627",
                        }}
                      >
                        Generar QR
                      </button>
                    </a>
                    <button
                      key={ruta.id}
                      onClick={(e) => borrarRuta(ruta.id, e)}
                      style={{
                        boxShadow: "inset 0px 1px 0px 0px #f29c93",
                        background:
                          "linear-gradient(to bottom, #fe1a00 5%, #ce0100 100%)",
                        backgroundColor: "#fe1a00",
                        borderRadius: "6px",
                        border: "1px solid #d83526",
                        display: "inline-block",
                        cursor: "pointer",
                        color: "#ffffff",
                        fontFamily: "Arial",
                        fontSize: "15px",
                        fontWeight: "bold",
                        padding: "6px 24px",
                        textDecoration: "none",
                        textShadow: "0px 1px 0px #b23e35",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Cargando...</p>
          )}

          <Link href="./agregarRuta">
            <div
              className={styles.button}
              style={{
                width: "100%",
                backgroundColor: "#00B399",
                marginTop: "30px",
                borderRadius: "10px",
                textAlign: "center",
                padding: "10px 0px",
                color: "white",
                marginBottom: "50px",
              }}
            >
              Agregar Ruta
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
