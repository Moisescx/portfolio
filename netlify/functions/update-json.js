const axios = require('axios');

exports.handler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "El cuerpo de la solicitud está vacío." }),
        };
    }

    let imagenes;
    try {
        ({ imagenes } = JSON.parse(event.body));
        if (!imagenes || !Array.isArray(imagenes)) {
            throw new Error("El campo 'imagenes' debe ser un array.");
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Error al analizar el cuerpo de la solicitud.", details: error.message }),
        };
    }

    const dataJsonUrl = 'https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json';
    const headers = {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    try {
        const { data: { sha } } = await axios.get(dataJsonUrl, { headers });

        await axios.put(dataJsonUrl, {
            message: 'Actualizar galería',
            content: Buffer.from(JSON.stringify(imagenes, null, 2)).toString('base64'),
            sha: sha,
        }, { headers });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error("Error al actualizar JSON:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al actualizar JSON", details: error.message }),
        };
    }
};