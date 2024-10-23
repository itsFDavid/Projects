const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const z = require('zod');
const { pool } = require('../models/userModel');
const { sendVerificationEmail } = require('../utils/mailer');


const userSchema = z.object({
    email: z.string().email({message: 'Email invalido'}),
    password: z.string().min(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
});

const loginSchema = z.object({
    email: z.string().email({message: 'Email invalido'}),
    password: z.string().min(6, {message: 'La contraseña debe tener al menos 6 caracteres'}),
});


exports.register = async (req, res) => {
    try {
        const { email, password} = userSchema.parse(req.body);
        const role = 'usuario';
        const hashedPassword = await bcrypt.hash(password, 10);

        const [user] = await pool.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
        if(user.affectedRows === 0) return res.status(400).json({ message: 'No se pudo registrar el usuario' });

        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({ message: 'Usuario registrado, verifique su email' });
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar el usuario, intente mas tarde' });
    }
};


exports.login = async (req, res, next) => {
    try{
        const { email, password } = loginSchema.parse(req.body);

        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });

        const user = rows[0];

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {algorithm: 'HS256', expiresIn: '1d' },);
        res.json({ token });
    }catch(error){
        next(error);
    }
};


exports.logout = (req, res) => {
    res.json({ message: 'Sesión cerrada correctamente' });
};
