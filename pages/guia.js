import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

import styles from "../styles/gestorRutasTarjetas.module.css";

const urlApi = process.env.API_URL;

export default function guia() {
  const router = useRouter();
  //*Obtener de los parametros de la url el id de la ruta y el punto de control actual
  const { id, pc } = router.query;
  //*Estado para guardar el nombre de la ruta
  const [rutaNombre, setRutaNombre] = useState(null);
  //*Estado para guardar descripcion de la ruta
  const [rutaDescripcion, setRutaDescripcion] = useState(null);
  //*Estado para guardar el numero de puntos de control de la ruta
  const [rutaNumeroPuntos, setRutaNumeroPuntos] = useState(0);
  //*Estado para guardar los puntos de control de la ruta
  const [puntosRuta, setPuntosRuta] = useState([]);
  //*Estado para guardar el usuarioListo
  const [usuarioListo, setUsuarioListo] = useState(false);
  //*Estado para guardar la ubicacion del usuario
  const [ubicacion, setUbicacion] = useState([0, 0]);
  //*Estado para guardar la distancia entre el usuario y el punto de control
  const [distancia, setDistancia] = useState(99);
  //*Estado para guardar la visibilidad del boton de Realidad Aumentada
  const [botonRA, setBotonRA] = useState("none");

  //Datos de ubicacion de el siguiente punto de control
  const [siguientePuntoTemplate, setSiguientePuntoTemplate] = useState({
    id: 0,
    propiedades: {
      nombre: "",
      modelo: "",
      decripcion: "",
      fecha: "",
      ubicacion: {
        latitud: "20.1749",
        longitud: "-98.0572",
        descripcion: "Junto a mi compu",
      },
    },
  });

  //Metodo para iniciar la ruta y cambiar el estado de la ruta a "iniciada"
  async function iniciarRuta() {
    var siguientePunto;
    await axios
      .get(urlApi + "/admin/rutas/" + id)
      .then((res) => {
        // console.log(res.data);
        setRutaNombre(res.data.propiedades.nombre);
        setRutaDescripcion(res.data.propiedades.descripcion);
        setRutaNumeroPuntos(parseInt(res.data.propiedades.numeroPuntos, 10));
        setPuntosRuta(res.data.propiedades.puntosLista);
        siguientePunto = res.data.propiedades.puntosLista[pc - 1][0];
      })
      .catch((err) => {
        console.log(err);
      });
    //obtener datos de la tarjeta

    axios
      .get(urlApi + "/admin/tarjetas/" + siguientePunto)
      .then((res) => {
        // console.log(res.data);
        setSiguientePuntoTemplate(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //Metodo para calcular la distancia entre dos puntos
  const getMetros = function (lat1, lon1, lat2, lon2) {
    // console.count("Recibido: " + lat1 + " " + lon1 + " " + lat2 + " " + lon2);
    const rad = function (x) {
      return (x * Math.PI) / 180;
    };
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) *
        Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return 1000 * d.toFixed(6); //Retorna seis decimales
  };

  /*obtener la ubicacion del usuario con la api geoLocation, la ubicacion
   *La ubicacion se actualiza cada 5 segundos en un modo precisión */
  React.useEffect(() => {
    const obtenerUbicacion = setInterval(() => {
      let lat;
      let lon;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacion([position.coords.latitude, position.coords.longitude]);
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          setDistancia(
            getMetros(
              parseFloat(lat),
              parseFloat(lon),
              parseFloat(siguientePuntoTemplate.propiedades.ubicacion.latitud),
              parseFloat(siguientePuntoTemplate.propiedades.ubicacion.longitud)
            ).toFixed(2)
          );
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }, 5000);
    //Obtener la distancia entre el usuario y el punto de control y actualizar el estado
    return () => {
      clearInterval(obtenerUbicacion);
    };
  }, []);

  //Metodo para verificar a cuantos metros esta el usuario del punto de control
  React.useEffect(() => {
    if (distancia <= 10 && usuarioListo) {
      //en caso de que el usuario este a menos de 10 metros del punto de control
      //se a la api un get en la url /Tarjeta/:id/on donde id es el id del punto de control
      axios
        .get(urlApi + "/tarjeta/" + id + "/on")
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //en caso de que el usuario este a mas de 10 metros del punto de control
      //se a la api un get en la url /Tarjeta/:id/off donde id es el id del punto de control
      axios
        .get(urlApi + "/tarjeta/" + id + "/off")
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [distancia]);

  const redirigirAR = () => {
    console.log("Enviando datos a la api");
    //Verificar el camino que debe tomar el usuario
    console.log("Punto actual: " + pc);
    let puntoActual = parseInt(pc, 10) - 1;
    console.log("Punto actual para array: " + puntoActual);
    //Verificar si el punto actual esta en puntosRuta
    console.log("exsten mas puntos: " + puntoActual < puntosRuta.length);
    if (puntoActual < puntosRuta.length) {
      //obtener el valor de puntoRuta
      let puntoRuta = puntosRuta[puntoActual];
      console.log("Punto ruta: " + puntoRuta[1]);
      //Rediriigir al usuario a la pagina de ar correspondiente
      window.location.href =
        urlApi +
        "/ar/renderizado/" +
        puntoRuta[1] +
        "?id=" +
        id +
        "&pc=" +
        (parseInt(pc, 10) + 1);
    } else {
      console.log("No hay mas puntos");
      //Redirigir al usuario a la pagina de finalizacion
      window.location.href = urlApi + "/llegaste";
    }
  };

  return (
    //Si el usuario esta listo para comenzar la guia, se muestra el boton de comenzar
    //Si no, se muestra un mensaje de que el usuario debe estar listo para comenzar
    //cuando el usuario presiona el boton de comenzar, se muestra el identificador de la tarjeta
    //y se muestra el boton de ver query
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        padding: "0 20px",
      }}
    >
      {usuarioListo ? (
        <div>
          <h1
            style={{
              padding: "0 0 50px 0",
            }}
          >
            Tu siguiente punto de control es {rutaNombre}
          </h1>
          <h2>Descripcion de la ruta:</h2>
          <p> {rutaDescripcion}</p>
          <h2
            style={{
              padding: "50px 0 0 0",
            }}
          >
            Tienes que llegar al <b>Punto de control</b> ubicado en:
          </h2>
          <div className={styles.tarjeta}>
            <p>{siguientePuntoTemplate.propiedades.ubicacion.descripcion}</p>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <p>
                Latitud: {siguientePuntoTemplate.propiedades.ubicacion.latitud}
              </p>
              <p>
                Longitud:{" "}
                {siguientePuntoTemplate.propiedades.ubicacion.longitud}
              </p>
            </div>
          </div>

          <h4>Tu ubicacion es: </h4>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <p>Latitud: {ubicacion[0] ? ubicacion[0] : "Cargando..."}</p>
            <p>Longitud: {ubicacion[0] ? ubicacion[0] : "Cargando..."}</p>
          </div>
          <h4>Distancia restante: {distancia} metros</h4>
          <div
            id="ar"
            style={{
              width: "100%",
              backgroundColor: "#00B399",
              marginTop: "30px",
              borderRadius: "10px",
              textAlign: "center",
              padding: "10px 0px",
              color: "white",
              visibility: distancia < 10 ? "visible" : "hidden",
            }}
          >
            <div onClick={() => redirigirAR()}>Realidad Aumentada</div>
          </div>
        </div>
      ) : (
        <div>
          <h1>¿Estas list@ para ver tu siguiente punto de control?</h1>
          <Image src="/img/puntoControl.png" width={500} height={500} />
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
            onClick={() => {
              setUsuarioListo(true);
              iniciarRuta();
            }}
          >
            List@
          </div>
        </div>
      )}
    </div>
  );
}
