import display from './page.module.css';

export default function Home() {
  return (
   <>
    <h1 className={display.page}>Modelos de ML</h1>
    <p className={display.description}>
      A simple web app to explore models.
    </p>
   </>
  );
}
