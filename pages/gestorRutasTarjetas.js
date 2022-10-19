import React from "react";
import axios from "axios";
import Link from "next/link";


const urlApi = "https://api-guia-escolar.herokuapp.com/" || "localhost:3001";

export default function GeneradorRutas() {
  const [tarjetas, setTarjetas] = React.useState(null);
  const [rutas, setRutas] = React.useState(null);

  const actualizarTarjetas = () => {
    axios
      .get(urlApi + "/admin/tarjetas")
      .then((res) => {
        setTarjetas(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(urlApi + "/admin/rutas").then((res) => {
      setRutas(res.data);
      console.log(res.data);
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
          console.log(res);
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
          console.log(res);
          actualizarTarjetas();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Generador de rutas y gestor de tarjetas</h1>
        <p>
          Esta pagina genera las rutas para la app, tambien puedes agregar
          nuevas tarjetas para apliar tus rutas
        </p>
      </div>
      <div className="container">
        <h2>
          Tus tarjetas disponibles
          <Link href="./agregarTarjeta">Agregar tarjeta</Link>
        </h2>
        <div className="tarjetas">
          {tarjetas ? (
            tarjetas.map((tarjeta) => {
              return (
                <div className="tarjeta" id={tarjeta.id} key={tarjeta.id}>
                  <h3>Nombre: {tarjeta.propiedades.nombre}</h3>
                  <p>Identificador: {tarjeta.id}</p>
                  <p>{tarjeta.propiedades.modelo}</p>
                  <button
                    key={tarjeta.id}
                    onClick={(e) => borrarTarjeta(tarjeta.id, e)}
                  >
                    Eliminar
                  </button>
                </div>
              );
            })
          ) : (
            <p>Cargando...</p>
          )}
        </div>
        <h2>
          Tus rutas <Link href="./agregarRuta">Agregar Rutas</Link>
        </h2>
        <div className="rutas">
          {rutas ? (
            rutas.map((ruta) => {
              return (
                <div className="ruta" id={ruta.id} key={ruta.id}>
                  <h3>Nombre: {ruta.propiedades.nombre}</h3>
                  <p>Description: {ruta.propiedades.descripcion}</p>
                  <p>Numero de puntos de control: {ruta.numeroPuntos}</p>
                  <p>Identificador: {ruta.id}</p>
                  <button key={ruta.id} onClick={(e) => borrarRuta(ruta.id, e)}>
                    Eliminar
                  </button>
                  {/* Peticion get para generar un QR con la api, le envia el string: "ruta"+ruta.id */}
                  <a
                    href={urlApi + "/generadorQR/" + "ruta" + ruta.id}
                    download="true"
                  >
                    <button>Generar QR</button>
                  </a>
                </div>
              );
            })
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      </div>
    </div>
  );
}
