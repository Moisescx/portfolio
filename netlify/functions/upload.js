const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    // 1. Verificar autenticación
    const user = context.clientContext?.user;
    if (!user || user.email !== 'moisesmarinavalos16@gmail.com') { // ¡Mismo email que arriba!
        return { statusCode: 403, body: 'Acceso denegado' };
    }

    // 2. Procesar imagen (ejemplo simplificado)
    const { image, title } = JSON.parse(event.body);

    // 3. Guardar en repositorio (requiere configuración adicional)
    // ... (ver nota abajo)

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Imagen recibida' })
    };
};