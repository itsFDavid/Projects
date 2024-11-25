"use client";
import React, { useState } from "react";
import Link from "next/link";
import display from "@src/page.module.css";
import { useRouter } from "next/router";

export default function Nav({
  background,
}: {
  background?: React.CSSProperties["background"];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  const closeSession = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <nav className={`${display.nav}`} style={{ background }}>
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
            href="/"
            className={`${display.link_nav} ${display.link_register}`}
            onClick={closeSession}
          >
            Cerrar Sesion
          </Link>
        </li>
      </ul>
    </nav>
  );
}
