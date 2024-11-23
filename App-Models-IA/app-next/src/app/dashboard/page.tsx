// src/app/dashboard/page.tsx
"use client";

import Nav from "@src/components/nav";
import styles from "./dashboard.module.css";
import { MODELS } from "@src/utils/models";

const Dashboard = () => {
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
