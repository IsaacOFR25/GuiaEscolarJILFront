import React from "react";
import axios from "axios";

const urlApi = "https://api-guia-escolar.herokuapp.com/" || "localhost:3001";

export default function agregarTarjeta() {
  const [identificador, setIdentificador] = React.useState("");

  React.useEffect(() => {
    axios
      .get(urlApi + "/admin/tarjetas")
      .then((res) => {
        //Guarda el res.data.id de la ultima tarjeta en la variable id
        const id = res.data[res.data.length - 1].id;
        //Convertir a int y Suma uno al id de la ultima tarjeta
        const nuevoId = parseInt(id, 10) + 1;
        //coloca el nuevo id en el estado identificador
        setIdentificador(nuevoId);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div>
      <h1>Agregar nueva tarjeta</h1>
      <div>
        {/* //Formulario para agregar nueva tarjeta, se envia via axios a la api en */}
        {/* la ruta "/admin/tarjetas/agregar" */}
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={(e) => {
            e.preventDefault();
            const identificador = e.target.identificador.value;
            const nombre = e.target.nombre.value;
            const modelo = e.target.modelo.value;
            const descripcion = e.target.descripcion.value;
            const fecha = e.target.fecha.value;
            //Ubicacion de la tarjeta
            const latitud = e.target.latitud.value;
            const longitud = e.target.longitud.value;
            const descripcionUbicacion = e.target.descripcionUbicacion.value;
            //TODO agregar codigo cpp para agregar nueva tarjeta
            const codigoCpp = "TODO agregar codigo cpp";
            const nuevaTarjeta = {
              id: identificador,
              propiedades: {
                nombre: nombre,
                modelo: modelo,
                decripcion: descripcion,
                fecha: fecha,
                ubicacion: {
                  latitud: latitud,
                  longitud: longitud,
                  descripcion: descripcionUbicacion,
                },
                codigo: codigoCpp,
              },
            };
            axios
              .post(urlApi + "/admin/tarjetas/agregar", nuevaTarjeta)
              .then((res) => {
                console.log(res);
                //Si recibe un 200 de la api, redirecciona a la pagina de gestor de rutas y tarjetas
                if (res.status === 200) {
                  window.location.href = "/gestorRutasTarjetas";
                }
              })
              .catch((err) => {
                console.log(err);
                //Si recibe un error de la api, muestra un mensaje de error en un alert
                alert("Error al agregar tarjeta " + err);
              });
          }}
        >
          <label htmlFor="identificador">Identificador</label>
          {/* El identificador se obtiene haciendo una peticion get de las tarjetas a la
          api y sumandole uno */}
          <input
            type="text"
            name="identificador"
            id="identificador"
            value={identificador}
            readOnly
          />

          <label htmlFor="nombre">Nombre</label>
          <input type="text" name="nombre" id="nombre" />
          {/* Un elemento select donde solo existen las opciones de "ESP32" y "NodeMCU" */}
          <label htmlFor="modelo">Modelo</label>
          <select name="modelo" id="modelo">
            <option value="ESP32">ESP32</option>
            <option value="NodeMCU">NodeMCU</option>
          </select>
          <label htmlFor="descripcion">Descripcion</label>
          <input type="text" name="descripcion" id="descripcion" />
          <label htmlFor="fecha">Fecha</label>
          {/* //La fecha no es editable, se genera automaticamente */}
          <input
            type="date"
            name="fecha"
            id="fecha"
            value={new Date().toISOString().slice(0, 10)}
            readOnly
          />
          <label htmlFor="latitud">Latitud</label>
          <input name="latitud" id="latitud" />
          <label htmlFor="longitud">Longitud</label>
          <input name="longitud" id="longitud" />
          {/* //Un boton que al presionarlo obtiene la ubicacion actual del usuario
          y remplace los valores de latitud y longitud obtenidos y los muestra
          en los inputs */}
          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  document.getElementById("latitud").value =
                    position.coords.latitude;
                  document.getElementById("longitud").value =
                    position.coords.longitude;
                });
              } else {
                alert("Geolocation is not supported by this browser.");
              }
            }}
          >
            Obtener ubicacion actual
          </button>
          <label htmlFor="descripcionUbicacion">
            Descripcion de la ubicacion
          </label>
          <input
            type="text"
            name="descripcionUbicacion"
            id="descripcionUbicacion"
            placeholder="Describe el lugar donde estara el punto de control"
          />
          <button type="submit">Agregar</button>
        </form>
      </div>
    </div>
  );
}
