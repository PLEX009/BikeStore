// -----------------------------------------------------------------------------
// upload.js - Middleware para manejo de subida de archivos con multer
// -----------------------------------------------------------------------------

import multer from 'multer';
import path from 'path';

// Configuración del almacenamiento para multer
// Define dónde y cómo se guardarán los archivos subidos
const storage = multer.diskStorage({
  // Directorio de destino para los archivos subidos
  destination: function (req, file, cb) {
    cb(null, 'src/assets/uploads'); // Carpeta donde se guardan los archivos
  },
  // Nombre del archivo guardado: usa timestamp + nombre original para evitar duplicados
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Inicializa el middleware de multer con la configuración de almacenamiento
const upload = multer({ storage });

// Exporta el middleware para ser usado en rutas que reciben archivos
export default upload;
  