const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    // Parsear datos del formulario
    const formData = JSON.parse(event.body);
    const fileBuffer = Buffer.from(formData.file, 'base64');
    const filename = formData.filename;

    try {
        // Ruta ABSOLUTA (crítica para Netlify)
        const filePath = path.join(process.cwd(), 'img', 'galeria', filename);
        
        // Guardar archivo
        fs.writeFileSync(filePath, fileBuffer);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ url: `/img/galeria/${filename}` })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};