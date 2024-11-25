import display from "@src/page.module.css";
import Link from "next/link";


export default function PreviewModels({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <Link  href="/register" className={display.preview_ml}>
      <h2>Modelo de {name}</h2>
      <div className="">
        <p>{description}</p>
      </div>
    </Link>
  );
}
