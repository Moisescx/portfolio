const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const { imagenes } = JSON.parse(event.body);
    const filePath = path.join(process.cwd(), 'img', 'galeria', 'data.json');
    
    try {
        fs.writeFileSync(filePath, JSON.stringify(imagenes, null, 2));
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al actualizar JSON" })
        };
    }
};