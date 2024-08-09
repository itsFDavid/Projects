import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (token === 'kjcndsbjcdsncisdjn') {
        req.admin = true;
        return next();
    }

    req.admin = false;
    return res.status(401).json({ message: 'Unauthorized' });
};

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/admin', verifyToken, (req, res) => {
    if (req.admin) {
        res.render('admin');
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
        const token = 'kjcndsbjcdsncisdjn';
        return res.json({ message: 'Login successful', token });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/api/users', verifyToken, (req, res) => {
    if (!req.admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ message: 'List of users' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
