"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Nav from "@src/components/nav";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>(""); // Estado para errores
  const [success, setSuccess] = useState<string>(""); // Estado para éxito

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return "Por favor, completa todos los campos.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return "Por favor, ingresa un correo electrónico válido.";
    }

    return ""; // Si no hay errores
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess(""); // Limpiar cualquier mensaje de éxito
    } else {
      setError(""); // Limpiar el error
      setSuccess(""); // Limpiar cualquier mensaje de éxito

      try {
        // Aquí iría la llamada a la API para hacer login
        console.log("Datos a enviar:", formData);
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccess("Inicio de sesión exitoso.");
          setError("");
          router.push("/dashboard");
          localStorage.setItem("authToken", data.token);
        } else {
          setError("Algo salió mal. Intenta de nuevo.");
        }
      } catch (err) {
        console.log("Error al iniciar sesión:", err);
        setError("Hubo un error al intentar iniciar sesión.");
      }
    }
  };

  return (
    <>
      <Nav />
      <section className={styles.main}>
        <div className={styles.formContainer}>
          <h2 className={styles.tittle}>Iniciar Sesión</h2>
          {error && <div className={styles.error}>{error}</div>}{" "}
          {success && <div className={styles.success}>{success}</div>}{" "}
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
            <button type="submit">Iniciar sesión</button>
          </form>
        </div>
      </section>
    </>
  );
}
