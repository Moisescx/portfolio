const axios = require('axios');

// Función para actualizar el archivo data.json en GitHub
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
            console.error("Error al obtener data.json:", error.message);
            throw new Error("No se pudo obtener el archivo data.json.");
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
    try {
        await axios.put(
            dataJsonUrl,
            {
                message: 'Actualizar galería',
                content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
                sha: sha, // Si es null, GitHub creará el archivo
            },
            { headers }
        );
    } catch (error) {
        console.error("Error al actualizar data.json:", error.message);
        throw new Error("No se pudo actualizar el archivo data.json.");
    }
}

// Función para subir una imagen a GitHub
async function subirImagenAGitHub(filename, fileContent) {
    const imageUrl = `https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/${filename}`;
    const headers = {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    try {
        await axios.put(imageUrl, {
            message: `Subir imagen ${filename}`,
            content: fileContent, // Archivo en base64
        }, { headers });

        return `https://raw.githubusercontent.com/Moisescx/portfolio/master/img/galeria/${filename}`;
    } catch (error) {
        console.error("Error al subir la imagen a GitHub:", error.message);
        throw new Error("No se pudo subir la imagen a GitHub.");
    }
}

// Función principal del handler
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

    try {
        // Subir la imagen a GitHub
        const base64File = file; // Archivo en base64 recibido del frontend
        const imageUrl = await subirImagenAGitHub(filename, base64File);

        // Actualizar data.json con la nueva imagen
        await actualizarDataJson([
            {
                src: imageUrl,
                titulo: title,
            },
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Imagen subida correctamente" }),
        };
    } catch (error) {
        console.error("Error en el proceso de subida:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};