import Link from "next/link";
import display from "@src/page.module.css";

export default function Nav() {
  return (
    <nav className={display.nav}>
      <h3 className={display.description_nav}>Prueba Modelos De ML</h3>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}