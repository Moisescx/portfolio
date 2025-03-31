const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const { file, filename } = JSON.parse(event.body);
    
    try {
        // Guardar la imagen en /img/galeria/
        const filePath = path.join(__dirname, '../../img/galeria', filename);
        fs.writeFileSync(filePath, file);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al guardar la imagen" })
        };
    }
};