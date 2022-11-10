import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

import styles from "../styles/gestorRutasTarjetas.module.css";

const urlApi = "https://api-guia-escolar.herokuapp.com";
var longitudPunto = 0;
var latitudPunto = 0;
var puntosRuta = [];

export default function guia2() {
  //Parametros de la url
  const router = useRouter();
  const { id, pc } = router.query;
  //JSON ruta y JSON Punto de control
  const [ruta, setRuta] = useState({});
  const [punto, setPunto] = useState({});
  //Estados de nuestra pagina
  const [ubicacion, setUbicacion] = useState([0, 0]);
  const [distancia, setDistancia] = useState(99);
  const [usuarioListo, setUsuarioListo] = useState(false);
  const [existeSigPunto, setExisteSigPunto] = useState(false);

  useEffect(() => {
    //Obtener ruta y dentro de esta obtener el punto de control acutual, despues llama a la funcion para obtener el punto especifico y lo guarda en el estado
    setRuta(obtenerJSONRuta());
  }, [id]);

  useEffect(() => {
    //Verifica si existe el punto de control actual
    setExisteSigPunto(isNotNull(punto.propiedades));
  }, [punto]);

  useEffect(() => {
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
              parseFloat(latitudPunto),
              parseFloat(longitudPunto)
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

  useEffect(() => {
    if (distancia <= 30 && usuarioListo) {
      console.log("Encendido tarjeta: " + pc);
      //en caso de que el usuario este a menos de 10 metros del punto de control
      //se a la api un get en la url /Tarjeta/:id/on donde id es el id del punto de control
      axios
        .get(urlApi + "/tarjeta/" + pc + "/on")
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Apagando tarjeta: " + pc);

      //en caso de que el usuario este a mas de 10 metros del punto de control
      //se a la api un get en la url /Tarjeta/:id/off donde id es el id del punto de control
      axios
        .get(urlApi + "/tarjeta/" + pc + "/off")
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [distancia]);

  const obtenerJSONRuta = () => {
    axios
      .get(urlApi + "/admin/rutas/" + id)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setRuta(data);
        return data;
      })
      .then((data) => {
        console.log(data.propiedades.puntosLista[pc - 1][0]);
        obtenerJSONPunto(data.propiedades.puntosLista[pc - 1][0]);
        puntosRuta = data.propiedades.puntosLista;
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const obtenerJSONPunto = (idPunto) => {
    axios
      .get(urlApi + "/admin/tarjetas/" + idPunto)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setPunto(data);
        return data;
      })
      .then((data) => {
        //Tambien se almacena la longitud y latitud del punto de control en variables globales
        longitudPunto = parseFloat(data.propiedades.ubicacion.longitud);
        latitudPunto = parseFloat(data.propiedades.ubicacion.latitud);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Metodo para calcular la distancia entre dos puntos
  const getMetros = function (lat1, lon1, lat2, lon2) {
    console.count("Recibido: " + lat1 + " " + lon1 + " " + lat2 + " " + lon2);
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

  const redirigirAR = () => {
    console.log("Enviando datos a la api");
    //Verificar el camino que debe tomar el usuario
    console.log("Punto actual: " + pc);
    let puntoActual = parseInt(pc, 10) - 1;
    console.log("Punto actual para array: " + puntoActual);
    //Verificar si el punto actual esta en puntosRuta
    console.log("Puntos de la ruta: " + puntosRuta);
    // console.log("exsten mas puntos: " + puntoActual < puntosRuta.length);
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
    }
  };

  //Verifica si el valor recibido es null o undefined
  const isNotNull = (value) => {
    //regresa true si el valor no es null o undefined
    console.log("El valor es: " + value, value !== null && value !== undefined);
    return value !== null && value !== undefined;
  };

  const redirigirFinal = () => {
    window.location.href = "/llegaste";
  };

  //Renderiza pantalla para confirmar si el usuario esta listo cuando este sea true,
  //Renderiza seguimiento de punto cuando el usuario tenga punto, si no, redirije a llegaste.js
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
            Tu siguiente punto de control es{punto.propiedades.nombre}
          </h1>
          <h2>Descripcion de la ruta:</h2>
          <p> {ruta.propiedades.descripcion}</p>
          <h2
            style={{
              padding: "50px 0 0 0",
            }}
          >
            Tienes que llegar al <b>Punto de control</b> ubicado en:
          </h2>
          <div className={styles.tarjeta}>
            <p>{punto.propiedades.ubicacion.descripcion}</p>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <p>Latitud: {punto.propiedades.ubicacion.latitud}</p>
              <p>
                Longitud:
                {punto.propiedades.ubicacion.longitud}
              </p>
            </div>
          </div>

          <h4>Tu ubicacion es: {ubicacion}</h4>

          <h4>Distancia: {distancia} metros</h4>
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
              visibility: distancia < 30 ? "visible" : "hidden",
            }}
            onClick={() => redirigirAR()}
          >
            Realidad Aumentada
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
              existeSigPunto ? setUsuarioListo(true) : redirigirFinal();
            }}
          >
            List@
          </div>
        </div>
      )}
    </div>
  );
}
