const axios = require('axios');

async function actualizarDataJson(imagenes) {
    const dataJsonUrl = 'https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json';
    const headers = {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    let currentContent = { imagenes: [] }; // Estructura por defecto
    let sha = null;

    try {
        // Obtener el contenido actual de data.json
        const { data: { content, sha: existingSha } } = await axios.get(dataJsonUrl, { headers });
        const decodedContent = Buffer.from(content, 'base64').toString();
        currentContent = JSON.parse(decodedContent) || currentContent; // Asegurar estructura válida
        sha = existingSha;
    } catch (error) {
        if (error.response?.status === 404) {
            console.warn("El archivo data.json no existe. Se creará uno nuevo.");
        } else {
            throw error;
        }
    }

    // Validar que currentContent.imagenes sea un array
    if (!Array.isArray(currentContent.imagenes)) {
        console.warn("El campo 'imagenes' no es un array. Se inicializará como un array vacío.");
        currentContent.imagenes = [];
    }

    // Actualizar el contenido con las nuevas imágenes
    currentContent.imagenes = [...currentContent.imagenes, ...imagenes];

    // Subir el nuevo contenido
    await axios.put(
        dataJsonUrl,
        {
            message: 'Actualizar galería',
            content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
            sha: sha, // Si es null, GitHub creará el archivo
        },
        { headers }
    );
}

exports.handler = async (event, context) => {
    const authHeader = event.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "No autorizado" }),
        };
    }

    const token = authHeader.split(" ")[1];
    const [timestamp, password] = Buffer.from(token, 'base64').toString('utf8').split(":");

    const SERVER_PASSWORD = "4&zW4~/~G}Kfpd05MtD8'rEIEnn_~{~}v";
    if (password !== SERVER_PASSWORD || Date.now() - parseInt(timestamp) > 3600000) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Token inválido o expirado" }),
        };
    }

    const { file, filename, title } = JSON.parse(event.body || '{}');

    if (!file || !filename || !title) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Datos inválidos" }),
        };
    }

    // Actualizar data.json con la nueva imagen
    try {
        await actualizarDataJson([
            {
                src: `https://raw.githubusercontent.com/Moisescx/portfolio/master/img/galeria/${filename}`,
                titulo: title,
            },
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Imagen subida correctamente" }),
        };
    } catch (error) {
        console.error("Error al actualizar data.json:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al actualizar data.json" }),
        };
    }
};