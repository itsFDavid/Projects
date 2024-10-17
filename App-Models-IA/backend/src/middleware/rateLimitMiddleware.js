const jwt = require('jsonwebtoken');
const { pool } = require('../models/userModel');


const rateLimitMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó un token' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        
        const userId = decoded.id;
        const [rows] = await pool.execute('SELECT request_count, last_request_date FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });

        const user = rows[0];
        const today = new Date().toISOString().split('T')[0];
        const userLastRequest = user.last_request_date.toISOString().split('T')[0]



        if (userLastRequest !== today) {
            await pool.execute('UPDATE users SET request_count = 0, last_request_date = ? WHERE id = ?;', [today, userId]);
            user.request_count = 0;
        }

        if (user.request_count >= 3) {
            return res.status(429).json({ message: 'Has alcanzado el límite de 3 peticiones diarias' });
        }

        await pool.execute('UPDATE users SET request_count = request_count + 1 WHERE id = ?;', [userId]);

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o no proporcionado' });
    }
};

module.exports = rateLimitMiddleware;
