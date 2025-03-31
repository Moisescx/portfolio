const axios = require('axios');

exports.handler = async (event) => {
    try {
        const { file, filename, title, size } = JSON.parse(event.body);
        
        // 1. Validar tamaño (opcional)
        if (size > 5 * 1024 * 1024) { // 5MB máximo
            throw new Error("La imagen es demasiado grande (máx. 5MB)");
        }

        // 2. Subir a GitHub
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
          url: `https://raw.githubusercontent.com/Moisescx/portfolio/master/img/galeria/${filename}`
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