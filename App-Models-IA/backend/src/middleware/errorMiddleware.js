const errorHandler = (err, req, res, next) => {
    if (err.name === 'ZodError') {

        const errors = err.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
        }));
        return res.status(400).json({ errors });
    }
    console.error("Error en el servidor", err.message);

    res.status(500).json({ message: 'Ocurrió un error en el servidor' });
};

module.exports = errorHandler;