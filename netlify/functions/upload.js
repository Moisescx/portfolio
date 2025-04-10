const axios = require('axios');

async function actualizarDataJson(imagenes) {
  const dataJsonUrl = 'https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json';
  const headers = {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
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
          // Si el archivo no existe, inicializar con estructura por defecto
          console.warn("El archivo data.json no existe. Se creará uno nuevo.");
      } else {
          // Relanzar otros errores
          throw error;
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
  await axios.put(
      dataJsonUrl,
      {
          message: 'Actualizar galería',
          content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
          sha: sha, // Si es null, GitHub creará el archivo
          branch: 'master'
      },
      { headers }
  );
}

exports.handler = async (event) => {
    try {
        const { file, filename, title, size } = JSON.parse(event.body);

        // 1. Validar tamaño
        if (size > 5 * 1024 * 1024) {
            throw new Error("La imagen es demasiado grande (máx. 5MB)");
        }

        // 2. Subir imagen a GitHub
        const imagePath = `img/galeria/${filename}`;
        await axios.put(
            `https://api.github.com/repos/Moisescx/portfolio/contents/${imagePath}`,
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

        // 3. Actualizar data.json con la nueva imagen
        await actualizarDataJson([{ src: imagePath, titulo: title }]);

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