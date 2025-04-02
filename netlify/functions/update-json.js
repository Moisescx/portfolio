const axios = require('axios');

exports.handler = async (event) => {
    try {
        const { imagenes } = JSON.parse(event.body);
        const dataJsonUrl = 'https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json';

        // 1. Obtener el archivo actual (para el SHA)
        const { data: { sha } } = await axios.get(dataJsonUrl, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`
            }
        });

        // 2. Subir el nuevo contenido
        await axios.put(dataJsonUrl, {
            message: 'Actualizar galería',
            content: Buffer.from(JSON.stringify(imagenes, null, 2)).toString('base64'),
            sha: sha,
            branch: 'master'
        }, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Error al actualizar JSON",
                details: error.message
            })
        };
    }
};