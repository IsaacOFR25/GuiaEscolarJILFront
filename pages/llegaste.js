import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function llegaste() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        padding: "0 20px",
      }}
    >
      <h1>Haz llegado a tu destino</h1>
      <Image src="/img/finish.png" width={500} height={500} />
      <h2>Gracias por usar nuestro servicio</h2>
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
      >
        <Link href="/">Volver al inicio</Link>
      </div>
    </div>
  );
}
