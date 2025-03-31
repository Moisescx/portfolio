const axios = require('axios');

exports.handler = async (event) => {
  try {
    // 1. Parsear datos del formulario
    const { file, filename, title } = JSON.parse(event.body);
    
    // 2. Subir imagen a GitHub
    await axios.put(
      `https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/${filename}`,
      {
        message: `Subida: ${title}`,
        content: Buffer.from(file).toString('base64'),
        branch: 'master'
      },
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    // 3. Actualizar data.json (opcional)
    // ... (te ayudo con esto después)

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error al subir",
        details: error.response?.data || error.message
      })
    };
  }
};