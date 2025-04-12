exports.handler = async (event, context) => {
    const { password } = JSON.parse(event.body || '{}');

    const SERVER_PASSWORD = "4&zW4~/~G}Kfpd05MtD8'rEIEnn_~{~}v";

    if (password === SERVER_PASSWORD) {
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