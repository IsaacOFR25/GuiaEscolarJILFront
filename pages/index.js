import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    console.log(contador);
    if (contador === 5) {
      //redirigir a la pagina /gestorRutasTarjetas
      window.location.href = "/gestorRutasTarjetas";
    }
  }, [contador]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Guia Escolar</title>
        <meta
          name="description"
          content="Aplicacion guia en realidad aumentada para ITESA"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ with: "80%", heigth: "40%" }}>
          <Image
            src="/img/index.png"
            alt="Picture of the author"
            width={500}
            height={500}
            onClick={() => setContador(contador + 1)}
          />
        </div>
        <div style={{ margin: "0 20px" }}>
          <h1 className={styles.title}>
            Bienvenido a la aplicacion de Guia Escolar
          </h1>

          <p className={styles.description}>
            Te ayudaremos a encontrar tu camino en ITESA
          </p>
          <Link
            className={styles.button}
            style={{
              width: "100%",
              backgroundColor: "#00B399",
              marginTop: "30px",
              borderRadius: "10px",
              textAlign: "center",
              padding: "10px 0px",
              color: "white",
            }}
            href="./QRcodePage"
          >
            Escanear QR
          </Link>
        </div>
      </main>
    </div>
  );
}
