import React from "react";
import axios from "axios";

const urlApi = "http://localhost:3001";
export default function GeneradorRutas() {
  const [tarjetas, setTarjetas] = React.useState(null);
  const [rutas, setRutas] = React.useState(null);

  React.useEffect(() => {
    //TODO - Hacer que la respuesta de la API sea un elemento de React (funcion map)
    axios
      .get(urlApi + "/admin/rutas")
      .then((res) => {
        setTarjetas(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <div className="header">
        <h1>Generador de rutas</h1>
        <p>
          Esta pagina genera las rutas para la app, tambien puedes agregar
          nuevas tarjetas para apliar tus rutas
        </p>
      </div>
      <div className="container">
        <h2>Tus tarjetas disponibles</h2>
      </div>
    </div>
  );
}
