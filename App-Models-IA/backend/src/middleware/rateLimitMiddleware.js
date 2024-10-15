const requestCount = {};

const rateLimitMiddleware = (req, res, next) => {
    const userId = req.user.id;

    if (req.user.role === 'usuario') {
        if (!requestCount[userId]) {
            requestCount[userId] = 1;
        } else {
            requestCount[userId]++;
        }

        if (requestCount[userId] > 3) {
            return res.status(429).json({ message: 'Límite de peticiones alcanzado' });
        }
    }
    next();
};

module.exports = rateLimitMiddleware;
