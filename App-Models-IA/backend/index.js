require('dotenv').config();
const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const errorHandler = require('./src/middleware/errorMiddleware');


const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});




app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ´http://localhost:${PORT}´`);
});
