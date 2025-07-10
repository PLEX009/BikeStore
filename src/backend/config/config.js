// Importa dotenv para manejar variables de entorno desde un archivo .env
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env ubicado en src/backend/.env
dotenv.config({path: 'src/backend/.env'});

// Exporta un objeto de configuracion con las variables principales del backend
export default {
    // Puerto en el que correra el servidor (por defecto 3000 si no se define en .env)
    port: process.env.PORT || 3000,
    // Entorno de ejecucion (development, production, etc)
    nodeEnv: process.env.NODE_ENV || 'development',
    // Clave secreta para firmar JWT (tokens de autenticacion)
    jwtSecret: process.env.JWT_SECRET || '',
    // Tiempo de expiracion de los JWT
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    // Configuracion de CORS para permitir solicitudes desde el frontend
    cors: {
        // Origen permitido (por defecto el frontend en localhost:5173)
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        // Permite el envio de cookies y credenciales
        credentials: true
    }
};