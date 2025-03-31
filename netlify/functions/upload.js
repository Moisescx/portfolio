const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { file, filename, title } = JSON.parse(event.body);
    const imagePath = `img/galeria/${filename}`;
    
    // 1. Validar tipo de archivo
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExtension = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      throw new Error(`Formato no soportado. Usa: ${validExtensions.join(', ')}`);
    }

    // 2. Subir la imagen (como binario)
    const imageResponse = await axios.put(
      `https://api.github.com/repos/Moisescx/portfolio/contents/${imagePath}`,
      {
        message: `Subir imagen: ${title}`,
        content: Buffer.from(file, 'base64'),
        branch: 'master'
      },
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      }
    );

    // 3. Actualizar data.json
    const dataJsonUrl = `https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json`;
    
    // Obtener data.json actual
    const { data: { content, sha } } = await axios.get(dataJsonUrl, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });

    // Decodificar y modificar
    const currentContent = JSON.parse(Buffer.from(content, 'base64').toString()) || [];
    currentContent.push({
      src: imagePath,
      titulo: title
    });

    // Subir cambios
    await axios.put(
      dataJsonUrl,
      {
        message: `Actualizar galería con ${filename}`,
        content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
        sha: sha,
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
        imageUrl: `https://raw.githubusercontent.com/Moisescx/portfolio/master/${imagePath}`
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error en el proceso",
        details: error.response?.data || error.message,
        step: error.step || 'unknown'
      })
    };
  }
};