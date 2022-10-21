import React from "react";
import axios from "axios";
import Link from "next/link";
import styles from "../styles/gestorRutasTarjetas.module.css";

const urlApi = "https://api-guia-escolar.herokuapp.com";

export default function GeneradorRutas() {
  const [tarjetas, setTarjetas] = React.useState(null);
  const [rutas, setRutas] = React.useState(null);

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

  return (
    <div className={styles.container}>
      <div className="header">
        <h1>Generador de rutas y gestor de tarjetas</h1>
        <p>
          Esta pagina genera las rutas para la app, tambien puedes agregar
          nuevas tarjetas para apliar tus rutas
        </p>
      </div>
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

          <Link
            style={{
              width: "100%",
              backgroundColor: "#00B399",
              marginTop: "30px",
              borderRadius: "10px",
              textAlign: "center",
              padding: "10px 0px",
              color: "white",
            }}
            href="./agregarTarjeta"
          >
            Agregar tarjeta
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
                    <button
                      key={ruta.id}
                      onClick={(e) => borrarRuta(ruta.id, e)}
                    >
                      Eliminar
                    </button>
                    {/* Peticion get para generar un QR con la api, le envia el string: "ruta"+ruta.id */}
                    <a
                      href={urlApi + "/generadorQR/" + ruta.id}
                      download="true"
                    >
                      <button>Generar QR</button>
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Cargando...</p>
          )}

          <Link
            style={{
              width: "100%",
              backgroundColor: "#00B399",
              marginTop: "30px",
              borderRadius: "10px",
              textAlign: "center",
              padding: "10px 0px",
              color: "white",
            }}
            href="./agregarRuta"
          >
            Agregar Rutas
          </Link>
        </div>
      </div>
    </div>
  );
}
