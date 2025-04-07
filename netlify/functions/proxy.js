const fetch = require('node-fetch');

exports.handler = async (event) => {
    const targetUrl = event.queryStringParameters.url;

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Falta el parámetro 'url'" }),
        };
    }

    try {
        const response = await fetch(targetUrl);
        const data = await response.text();

        return {
            statusCode: 200,
            body: data,
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*', // Permitir solicitudes desde cualquier origen
            },
        };
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al obtener los datos" }),
        };
    }
};