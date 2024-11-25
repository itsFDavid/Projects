require("dotenv").config();
const express = require("express");
const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

app.use(cors());
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// app.use((err, req, res, next) => {
// console.error(err.stack);
// res.status(500).json({ message: 'Ocurrió un error, intente mas tarde'});
// });

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ´http://localhost:${PORT}´`);
});
