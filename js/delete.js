const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método no permitido" }),
        };
    }

    const { index } = JSON.parse(event.body || '{}'); // Índice de la imagen a eliminar
    if (index === undefined) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Índice no proporcionado" }),
        };
    }

    const dataJsonUrl = 'https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json';
    const headers = {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    try {
        // Obtener el contenido actual de data.json
        const { data: { content, sha } } = await axios.get(dataJsonUrl, { headers });
        const decodedContent = Buffer.from(content, 'base64').toString();
        const currentContent = JSON.parse(decodedContent);

        // Validar que el índice sea válido
        if (!Array.isArray(currentContent.imagenes) || index < 0 || index >= currentContent.imagenes.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Índice inválido" }),
            };
        }

        // Eliminar la imagen del array
        currentContent.imagenes.splice(index, 1);

        // Actualizar data.json en GitHub
        const updatedContent = Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64');
        await axios.put(dataJsonUrl, {
            message: "Eliminar imagen",
            content: updatedContent,
            sha,
        }, { headers });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Imagen eliminada correctamente" }),
        };
    } catch (error) {
        console.error("Error al eliminar la imagen:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al eliminar la imagen" }),
        };
    }
};