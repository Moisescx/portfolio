const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { file, filename, title } = JSON.parse(event.body);
    const imagePath = `img/galeria/${filename}`;
    
    // 1. Subir la imagen
    await axios.put(
      `https://api.github.com/repos/Moisescx/portfolio/contents/${imagePath}`,
      {
        message: `Subir imagen: ${title}`,
        content: Buffer.from(file).toString('base64'),
        branch: 'main'
      },
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    // 2. Actualizar data.json
    const dataJsonUrl = `https://api.github.com/repos/TU_USUARIO/TU_REPO/contents/img/galeria/data.json`;
    
    // Obtener data.json actual
    const { data: { content, sha } } = await axios.get(dataJsonUrl, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });

    // Decodificar y modificar
    const currentContent = JSON.parse(Buffer.from(content, 'base64').toString());
    currentContent.push({
      src: imagePath,
      titulo: title
    });

    // Subir cambios
    await axios.put(
      dataJsonUrl,
      {
        message: `Actualizar data.json con ${filename}`,
        content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
        sha: sha, // Necesario para actualizar el archivo existente
        branch: 'main'
      },
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error completo",
        details: error.response?.data || error.message
      })
    };
  }
};