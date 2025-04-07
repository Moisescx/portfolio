const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();
const PORT = 8080; // Cambia el puerto si es necesario

// Configuración del proxy CORS
const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Permitir todas las solicitudes
    requireHeader: ['origin', 'x-requested-with'], // Opcional: restringir solicitudes
    removeHeaders: ['cookie', 'cookie2'] // Elimina encabezados no necesarios
});

// Ruta para manejar las solicitudes proxy
app.use('/proxy', (req, res) => {
    req.url = req.url.replace('/proxy/', '/'); // Ajusta la URL para el proxy
    proxy.emit('request', req, res);
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy CORS activo en http://localhost:${PORT}`);
});