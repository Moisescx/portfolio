const axios = require('axios');

exports.handler = async (event) => {
    try {
        const { file, filename, title, size } = JSON.parse(event.body);
        
        // 1. Validar tamaño
        if (size > 5 * 1024 * 1024) {
            throw new Error("La imagen es demasiado grande (máx. 5MB)");
        }

        // 2. Subir imagen a GitHub
        const imageResponse = await axios.put(
            `https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/${filename}`,
            {
                message: `Subir imagen: ${title}`,
                content: file,
                branch: 'master'
            },
            {
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        // 3. Definir la ruta de la imagen (¡esto faltaba!)
        const imagePath = `img/galeria/${filename}`;

        // 4. Actualizar data.json
        const dataJsonUrl = `https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json`;
        
        // Obtener data.json actual
        let currentContent = { imagenes: [] }; // Estructura por defecto
        let sha = null;
        
        try {
            const { data: { content, sha: existingSha } } = await axios.get(dataJsonUrl, {
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`
                }
            });
            currentContent = JSON.parse(Buffer.from(content, 'base64').toString()) || currentContent;
            sha = existingSha;
        } catch (error) {
            if (error.response?.status !== 404) throw error; // Si no es "archivo no encontrado", relanza el error
        }

        // Añadir la nueva imagen (asumiendo que currentContent es { imagenes: [...] })
        currentContent.imagenes.push({
            src: imagePath,
            titulo: title
        });

        // Subir cambios
        await axios.put(
            dataJsonUrl,
            {
                message: `Actualizar galería con ${filename}`,
                content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
                sha: sha, // Si es null, GitHub creará el archivo
                branch: 'master'
            },
            {
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`
                }
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true,
                url: `https://raw.githubusercontent.com/Moisescx/portfolio/master/${imagePath}`
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: error.message,
                step: "subir-imagen",
                stack: error.stack 
            })
        };
    }
};