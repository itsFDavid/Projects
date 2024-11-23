import display from "@src/page.module.css";


export default function PreviewModels({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <section className={display.preview_ml}>
      <h2>Modelo de {name}</h2>
      <div className="">
        <p>{description}</p>
      </div>
    </section>
  );
}
