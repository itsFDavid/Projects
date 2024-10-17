const axios = require('axios');
const jwt = require('jsonwebtoken');
const { z } = require('zod');  
require('dotenv').config();


const requestSchema = z.object({
    n_elements: z.number().min(1, 'n_elements debe ser mayor que 0'),
    n_train: z.number().min(1, 'n_train debe ser mayor que 0'),
    n_test: z.number().min(1, 'n_test debe ser mayor que 0')
});

exports.modelEndpoint = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No se proporcionó un token' });
        }
        
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        const { n_elements, n_train, n_test } = requestSchema.parse(req.body);

        if (n_train + n_test !== n_elements) {
            return res.status(400).json({ message: 'La suma de n_train y n_test debe ser igual a n_elements' });
        }
        
        if (n_train <= n_test) {
            return res.status(400).json({ message: 'n_train debe ser mayor que n_test' });
        }

        const externalApiResponse = await axios.post(
            `${process.env.MODEL_API}/email/predict`, 
            { n_elements, n_train, n_test }, 
            { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json({
            message: 'Petición a la API externa realizada correctamente',
            data: externalApiResponse.data
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }

        console.error("Error realizando la petición a la API externa:", error.message);
        res.status(500).json({
            message: 'Error realizando la petición a la API externa',
            error: error.message
        });
    }
};
