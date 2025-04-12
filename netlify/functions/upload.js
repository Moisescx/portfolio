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

exports.handler = async (event, context) => {
    const authHeader = event.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "No autorizado" }),
        };
    }

    const token = authHeader.split(" ")[1];
    const [timestamp, password] = Buffer.from(token, 'base64').toString('utf8').split(":");

    // Verifica que el token sea válido
    const SERVER_PASSWORD = "supersecurepassword";
    if (password !== SERVER_PASSWORD || Date.now() - parseInt(timestamp) > 3600000) { // 1 hora de validez
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Token inválido o expirado" }),
        };
    }

    // Procesar la subida de la imagen
    const { file, filename, title } = JSON.parse(event.body || '{}');

    if (!file || !filename || !title) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Datos inválidos" }),
        };
    }

    // Aquí puedes guardar la imagen en un servicio como AWS S3, Cloudinary, etc.
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Imagen subida correctamente" }),
    };
};