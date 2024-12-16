// src/app/dashboard/page.tsx
"use client";

import styles from "./dashboard.module.css";
import { MODELS } from "@src/utils/models";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "@src/components/nav";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // Verifica si el usuario tiene una sesión
    const isAuthenticated = !!localStorage.getItem("authToken"); // O verifica de otra forma

    if (!isAuthenticated) {
      router.push("/login"); // Redirige al login si no está autenticado
    }
  }, [router]);
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <h1 className={styles.title}>Dashboard - Modelos de ML</h1>

        <div className={styles.modelGrid}>
          {MODELS.map((model) => (
            <div key={model.nombre} className={styles.modelCard}>
              <h2 className={styles.modelTitle}>{model.nombre}</h2>
              <p className={styles.modelDescription}>{model.descripcion}</p>
              <button className={styles.viewButton}>Ver Detalles</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
