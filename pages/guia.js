import React from "react";
import { useRouter } from "next/router";

export default function guia() {
  return (
    <div>
      <h1>Tu siguiente punto de control es "punto de control"</h1>
      <p>El punto de control se encuentra en la calle 1</p>
      <p>Estas aproximadamente a X metros de tu destino</p>
      <h2>¿Cómo llegar?</h2>
      <p>Para llegar a tu destino, debes dirigirte hacia el norte</p>
      <h2>¿Qué encontrarás en el punto de control?</h2>
      <p>En el punto de control encontrarás un monumento</p>
      "Aquí va el mapa"
      <a href="https://api-guia-escolar.herokuapp.com/ar/renderizado/izq">
        Ir al destino izquierdo
      </a>
      <a href="https://api-guia-escolar.herokuapp.com/ar/renderizado/der">
        Ir al destino izquierdo
      </a>
    </div>
  );
}
