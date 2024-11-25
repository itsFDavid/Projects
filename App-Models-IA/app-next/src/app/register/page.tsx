"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Nav from "@src/components/nav";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return "Por favor, completa todos los campos.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return "Por favor, ingresa un correo electrónico válido.";
    }

    if (formData.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden.";
    }

    return ""; // Si no hay errores
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
    } else {
      setError(""); // Limpiar errores
      console.log(formData);
      // Aquí puedes enviar los datos al servidor
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            // Si todo sale bien, redirigir a la página de inicio
            router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError("Hubo un error al procesar el registro.");
        });
    }
  };

  return (
    <>
      <Nav />
      <section className={styles.main}>
        <div className={styles.formContainer}>
          <h2 className={styles.tittle}>Registrarse</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Registrar</button>
          </form>
        </div>
      </section>
    </>
  );
}
