"use client";
import { useState } from "react";
import Link from "next/link";
import display from "@src/page.module.css";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={display.nav}>
      <Link href="/" className={display.description_nav}>
        Prueba Modelos De ML
      </Link>
      <button className={display.menuBtn} onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`${display.navLinks} ${menuOpen ? display.open : ""}`}>
        <button
          className={`${display.closeBtn} ${menuOpen ? display.active : ""}`}
          onClick={closeMenu}
        >
          {menuOpen ? "Cerrar" : ""}
        </button>
        <li>
          <Link
            href="/login"
            className={`${display.link_nav} ${display.link_login}`}
          >
            Iniciar Sesión
          </Link>
        </li>
        <li>
          <Link
            href="/register"
            className={`${display.link_nav} ${display.link_register}`}
          >
            Registrar
          </Link>
        </li>
      </ul>
    </nav>
  );
}
