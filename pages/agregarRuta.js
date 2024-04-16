import React from "react";
import axios from "axios";
import Link from "next/link";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
} from "react-icons/ai";
import { TextField, Button } from "@mui/material";

const urlApi = process.env.API_URL;

export default function agregarRuta() {
  const [identificador, setIdentificador] = React.useState("");
  const [numeroPuntos, setNumeroPuntos] = React.useState(0);
  const [puntosLista, setPuntosLista] = React.useState([]);

  const [tarjetas, setTarjetas] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(urlApi + "/admin/rutas")
      .then((res) => {
        //Si no hay rutas, se le asigna el valor 1
        if (res.data.length == 0) {
          setIdentificador(1);
        } else {
          //Guarda el res.data.id de la ultima tarjeta en la variable id
          const id = res.data[res.data.length - 1].id;
          //Convertir a int y Suma uno al id de la ultima tarjeta
          const nuevoId = parseInt(id, 10) + 1;
          //coloca el nuevo id en el estado identificador
          setIdentificador(nuevoId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //Obtiene los nombres y id de las tarjetas para mostrarlos en el div #puntosDisp
    axios
      .get(urlApi + "/admin/tarjetas")
      .then((res) => {
        setTarjetas(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
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
        <Link href="/gestorRutasTarjetas">
          <div>
            <AiOutlineArrowLeft
              style={{ width: "40px", height: "30px", paddingRight: "10px" }}
            />
          </div>
        </Link>
        <h3>Agregar Ruta</h3>
        <div
          style={{ width: "30px", height: "30px", paddingLefth: "10px" }}
        ></div>
      </div>
      <p style={{ margin: "10px 0 0 0", padding: "10px" }}>
        En este apartado podras agregar nuevas tarjetas a tu guia escolar.
        Asegurate de flashear la tarjeta que vas a agregar con el identificador
        indicado aqui.
      </p>
      <div style={{ width: "100vw", padding: "30px 10px" }}>
        {/* //Formulario para agregar nueva ruta, se envia via axios a la api en */}
        {/* la ruta "/admin/ruta/agregar" */}
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={(e) => {
            console.log("submit");
            e.preventDefault();
            const identificador = e.target.identificador.value;
            const nombre = e.target.nombre.value;
            const descripcion = e.target.descripcion.value;
            const fecha = new Date().toLocaleDateString();
            //Modificar la ultima entrada de puntosLista, el ultimo elemento[1] se remplaza por FIN
            puntosLista[puntosLista.length - 1][1] = "FIN";
            const nuevaRuta = {
              id: identificador,
              propiedades: {
                nombre: nombre,
                descripcion: descripcion,
                fecha: fecha,
                numeroPuntos: numeroPuntos,
                puntosLista: puntosLista,
              },
            };
            axios
              .post(urlApi + "/admin/rutas/agregar", nuevaRuta)
              .then((res) => {
                console.log(res);
                //redirect a la pagina de rutas
                window.location.href = "/gestorRutasTarjetas";
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <TextField
            id="identificador"
            name="identificador"
            label="Identificador"
            variant="outlined"
            value={identificador}
            type="number"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            id="nombre"
            name="nombre"
            label="Nombre o destino de la ruta"
            variant="outlined"
            type="text"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            id="descripcion"
            name="descripcion"
            label="Descripción de la ruta"
            variant="outlined"
            type="text"
            style={{ marginBottom: "20px" }}
          />

          <div>
            {/* A continuacion se muestra una lista de los nombres de los las tarjetas
cada nobre es un boton, al ser precionado se agregara el identificador de la tarjeta a el hook puntosLista y aumentara el contador de puntos*/}
            <h3>Lista de puntos de control</h3>
            <p>
              Selecciona en orden los puntos de control que tendra tu ruta.{" "}
              <br />
              Ejemplo: Tarjeta 1 - Izquierda, Tarjeta 2 - Derecha....
              <br />
              Nota: El ultimo punto que selecciones mostrara AR de Llegada al
              lugar
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {tarjetas &&
                tarjetas.map((tarjeta) => {
                  return (
                    <>
                      <div
                        style={{
                          margin: "0 0",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <p>{tarjeta.propiedades.nombre}</p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          alignItems: "stretch",
                        }}
                      >
                        <Button
                          startIcon={<AiOutlineArrowLeft />}
                          variant="outlined"
                          key={tarjeta.id}
                          onClick={() => {
                            setPuntosLista([
                              ...puntosLista,
                              [tarjeta.id, "IZQ"],
                            ]);
                            setNumeroPuntos(numeroPuntos + 1);
                          }}
                          style={{ margin: "5px", width: "33%" }}
                        ></Button>
                        <Button
                          endIcon={<AiOutlineArrowUp />}
                          variant="outlined"
                          key={tarjeta.id + 100}
                          onClick={() => {
                            setPuntosLista([
                              ...puntosLista,
                              [tarjeta.id, "REC"],
                            ]);
                            setNumeroPuntos(numeroPuntos + 1);
                          }}
                          style={{ margin: "5px", width: "33%" }}
                        ></Button>
                        <Button
                          endIcon={<AiOutlineArrowRight />}
                          variant="outlined"
                          key={tarjeta.id + 100}
                          onClick={() => {
                            setPuntosLista([
                              ...puntosLista,
                              [tarjeta.id, "DER"],
                            ]);
                            setNumeroPuntos(numeroPuntos + 1);
                          }}
                          style={{ margin: "5px", width: "33%" }}
                        ></Button>
                      </div>
                    </>
                  );
                })}
              {/* Boton para eliminar la ultima tarjeta agregada a puntosLista y restar 1 a numeroPuntos */}
              <button
                onClick={() => {
                  setPuntosLista(puntosLista.slice(0, -1));
                  setNumeroPuntos(numeroPuntos > 0 ? numeroPuntos - 1 : 0);
                }}
                type="button"
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
                Eliminar ultimo punto agregado
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "stretch",
            }}
          >
            <TextField
              id="numeroPuntos"
              name="numeroPuntos"
              label="#Puntos"
              variant="outlined"
              type="text"
              value={numeroPuntos}
              readOnlys
              style={{ margin: "20px 2px", width: "30%" }}
            />
            <TextField
              id="puntosLista"
              name="puntosLista"
              label="Puntos de la ruta"
              variant="outlined"
              type="text"
              value={puntosLista}
              readOnly
              style={{ margin: "20px 2px", width: "70%" }}
            />
          </div>
          <Button type="submit" variant="contained">
            Agregar ruta
          </Button>
        </form>
      </div>
    </div>
  );
}
