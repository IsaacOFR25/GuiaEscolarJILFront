import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

import styles from "../styles/gestorRutasTarjetas.module.css";

const urlApi = "https://guia-escolar-back-end-drago-do.vercel.app";
var longitudPunto = 0;
var latitudPunto = 0;
var puntosRuta = [];

export default function guia2() {
  //Parametros de la url
  const router = useRouter();
  const { id, pc } = router.query;
  //JSON ruta y JSON Punto de control
  const [ruta, setRuta] = useState(null);
  const [punto, setPunto] = useState(null);
  const [tarjetas, setTarjetas] = useState({});
  //Estados de nuestra pagina
  const [ubicacion, setUbicacion] = useState([0, 0]);
  const [distancia, setDistancia] = useState(99);
  const [usuarioListo, setUsuarioListo] = useState(false);
  const [existeSigPunto, setExisteSigPunto] = useState(false);
  //Para guardar el progreso del usuario
  const [progreso, setProgreso] = useState(null);
  //Funcion para obtener y renderizar el progreso del usuario
  const obtenerProgreso = () => {
    //Si el objeto ruta, y la variable pc  es diferente a null
    if (ruta != null && pc != null) {
      let numeroPuntos = parseInt(ruta.propiedades.numeroPuntos);
      let numeroPuntosCompletados = parseInt(pc) - 1;
      let contadorDeProgreso = 0;
      //Obtener el listado de puntos a recorrer ruta.propiedades.puntosLista
      let puntosLista = ruta.propiedades.puntosLista.map((punto) => {
        return punto[0];
      });
      console.log("Numero de puntos: " + numeroPuntos);
      console.log("tamaño array: " + puntosLista.length);
      console.log("Puntos lista: " + puntosLista);

      let elementoHTML = puntosLista.map((punto) => {
        // return tarjeta.propiedades.nombre;
        contadorDeProgreso++;
        let activo =
          contadorDeProgreso <= numeroPuntosCompletados ? true : false;
        return (
          <>
            <div className="infomacion-punto">
              <div className={activo ? "circulo activo" : "circulo"}>
                {contadorDeProgreso}
              </div>
              <p
                className={activo ? "informacion activo" : "informacion"}
                style={{ color: "#000", background: "none" }}
              >
                {
                  //Obtener el nombre del punto de el array de objetos tarjetas.propiedades.nombre
                  //Donde "punto" sea igual a tarjetas.id
                  tarjetas.map((tarjeta) => {
                    if (tarjeta.id == punto) {
                      return tarjeta.propiedades.nombre;
                    }
                  })
                }
              </p>
              {contadorDeProgreso !== numeroPuntos && (
                <div className={activo ? "linea activo" : "linea"}></div>
              )}
            </div>
          </>
        );
      });
      setProgreso(elementoHTML);
    }
  };
  useEffect(() => {
    //Obtener ruta y dentro de esta obtener el punto de control acutual, despues llama a la funcion para obtener el punto especifico y lo guarda en el estado
    setRuta(obtenerJSONRuta());
    obtenerJSONTarjetas();
  }, [id]);

  useEffect(() => {
    //Verifica si existe el punto de control actual
    setExisteSigPunto(isNotNull(punto));
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

  const obtenerJSONTarjetas = () => {
    axios
      .get(urlApi + "/admin/tarjetas/")
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setTarjetas(data);
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
    <>
      <div
        id="fondo"
        style={{
          backgroundColor: "#00B399",
          zIndex: "-1",
          width: "100vw",
          height: "28vh",
          borderRadius: "20px",
          position: "absolute",
          top: "-10px",
          visibility: usuarioListo ? "visible" : "collapse",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          padding: "0 20px",
          marginTop: "50px",
        }}
      >
        {usuarioListo ? (
          <div>
            <div
              style={{
                borderTopLeftRadius: "50px",
                borderBottomRightRadius: "50px",
                background: "#fff",
                textShadow:
                  "1px 0px 1px #CCCCCC, 0px 1px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 3px 2px 1px #CCCCCC, 2px 3px 1px #EEEEEE, 4px 3px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 5px 4px 1px #CCCCCC, 4px 5px 1px #EEEEEE, 6px 5px 1px #CCCCCC, 5px 6px 1px #EEEEEE, 7px 6px 1px #CCCCCC, 2px 2px 2px rgba(206,109,105,0)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  color: "#000",
                }}
              >
                <div>
                  <p style={{ margin: "10px 0 0 0", fontSize: "2rem" }}>
                    Estas a...
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "3rem",
                      margin: "4px 4px 30px 0",
                    }}
                  >
                    {distancia}
                    <span style={{ fontSize: "1rem" }}>mts</span>
                  </p>
                </div>
              </div>
            </div>

            <p
              style={{
                padding: "60px 0 0 0",
                fontSize: "1.5rem",
              }}
            >
              De {punto.propiedades.nombre}, tu siguiente{" "}
              <span style={{ color: "#00B399", fontWeight: "bold" }}>
                Punto de control
              </span>
            </p>
            <div
              className={styles.tarjeta}
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ marginTop: "0" }}>Recuerda que vamos hacia...</h3>
                <p style={{ color: "22222", margin: "0", marginTop: "5px" }}>
                  {" "}
                  {ruta.propiedades.descripcion}
                </p>
              </div>
              <Image src="/img/destination.png" width="80" height="80" />
            </div>

            <div
              className={styles.tarjeta}
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Image src="/img/next.png" width="80" height="80" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  marginLeft: "5px",
                }}
              >
                <h3 style={{ marginTop: "0" }}>Este está ubicado en...</h3>
                <p
                  style={{
                    color: "22222",
                    margin: "0",
                    marginTop: "5px",
                    maxWidth: "70%",
                    textOverflow: "clip",
                  }}
                >
                  {punto.propiedades.ubicacion.descripcion}
                </p>
              </div>
            </div>

            <div
              id="progreso"
              className="progreso-contenedor"
              style={{
                justifyContent:
                  parseInt(ruta.propiedades.numeroPuntos) > 4
                    ? "flex-start"
                    : "center",
              }}
            >
              {progreso}
            </div>

            <div
              id="ar"
              style={{
                width: "100%",
                backgroundColor: distancia < 30 ? "#00B399" : "rgb(0,0,0,0)",
                marginTop: "30px",
                borderRadius: "10px",
                textAlign: "center",
                padding: "10px 0px",
                color: distancia < 30 ? "white" : "#e63232",
                border: distancia < 30 ? "none" : "1px solid #e63232",
                borderRadius: "5px",
              }}
              onClick={() => (distancia < 30 ? redirigirAR() : null)}
            >
              {distancia < 30 ? "Realidad aumentada" : "No estas cerca..."}
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
                if (existeSigPunto) {
                  setUsuarioListo(true);
                  obtenerProgreso();
                } else {
                  redirigirFinal();
                }
              }}
            >
              List@
            </div>
          </div>
        )}
      </div>
    </>
  );
}
