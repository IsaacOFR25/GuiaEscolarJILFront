import React from "react";
import axios from "axios";

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
      <h1>Agrega una nueva ruta</h1>
      <div>
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
            const fecha = e.target.fecha.value;
            const numeroPuntosJson = { numeroPuntos: numeroPuntos };
            const puntosListaJson = { puntosLista: puntosLista };
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
          <label htmlFor="identificador">Identificador</label>
          <input
            type="text"
            name="identificador"
            value={identificador}
            readOnly
          />
          <label htmlFor="nombre">Nombre</label>
          <input type="text" name="nombre" />
          <label htmlFor="descripcion">Descripcion</label>
          <input type="text" name="descripcion" />
          <label htmlFor="fecha">Fecha</label>
          <input
            type="text"
            name="fecha"
            value={new Date().toLocaleDateString()}
            readOnly
          />
          <label htmlFor="numeroPuntos">Numero de puntos</label>
          <input
            type="number"
            name="numeroPuntos"
            value={numeroPuntos}
            readOnly
          />
          <label htmlFor="puntosLista">Puntos de la ruta</label>
          <input type="text" name="puntosLista" value={puntosLista} readOnly />

          <button type="submit">Agregar</button>
        </form>
        <div>
          {/* A continuacion se muestra una lista de los nombres de los las tarjetas
   cada nobre es un boton, al ser precionado se agregara el identificador de la tarjeta a el hook puntosLista y aumentara el contador de puntos*/}
          <h1>Lista de puntos de control</h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {tarjetas &&
              tarjetas.map((tarjeta) => {
                return (
                  <div>
                    <button
                      key={tarjeta.id}
                      onClick={() => {
                        setPuntosLista([...puntosLista, [tarjeta.id, "IZQ"]]);
                        setNumeroPuntos(numeroPuntos + 1);
                      }}
                    >
                      {tarjeta.propiedades.nombre} Direccion Izquierda
                    </button>
                    <button
                      key={tarjeta.id + 100}
                      onClick={() => {
                        setPuntosLista([...puntosLista, [tarjeta.id, "DER"]]);
                        setNumeroPuntos(numeroPuntos + 1);
                      }}
                    >
                      {tarjeta.propiedades.nombre} Direccion Derecha
                    </button>
                  </div>
                );
              })}
            {/* Boton para eliminar la ultima tarjeta agregada a puntosLista y restar 1 a numeroPuntos */}
            <button
              onClick={() => {
                setPuntosLista(puntosLista.slice(0, -1));
                setNumeroPuntos(numeroPuntos - 1);
              }}
            >
              Eliminar ultimo punto agregado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
