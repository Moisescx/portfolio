exports.handler = async (event, context) => {
    const { password } = JSON.parse(event.body || '{}'); // Recibe la contraseña desde el frontend

    // Contraseña segura almacenada en el servidor (puedes usar un hash en lugar de texto plano)
    const SERVER_PASSWORD = "supersecurepassword";

    if (password === SERVER_PASSWORD) {
        // Generar un token de sesión (puedes usar algo más robusto como JWT)
        const token = Buffer.from(`${Date.now()}:${SERVER_PASSWORD}`).toString('base64');

        return {
            statusCode: 200,
            body: JSON.stringify({ token }),
        };
    }

    return {
        statusCode: 401,
        body: JSON.stringify({ error: "Contraseña incorrecta" }),
    };
};