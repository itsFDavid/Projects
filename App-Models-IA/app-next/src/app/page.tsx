import display from "@src/page.module.css";
import Nav from "@components/nav";
import PreviewModels from "@components/previewModels";
import { MODELS } from "./utils/models";

export default function Home() {
  return (
    <>
      <Nav />
      <h1 className={display.tittle}>Modelos de ML</h1>
      <main className={display.main}>
        <section className={display.examples_ml}>
          {MODELS.map((model) => (
            <PreviewModels
              key={model.nombre}
              name={model.nombre}
              description={model.descripcion}
            />
          ))}
        </section>
      </main>
    </>
  );
}
