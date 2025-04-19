const axios = require("axios");

exports.handler = async (event) => {
  try {
    const dataJsonUrl =
      "https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json";

    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };

    if (event.httpMethod === "GET") {
      // Manejar solicitudes GET para devolver el contenido de data.json
      const { data: fileData } = await axios.get(dataJsonUrl, { headers });
      const decodedContent = Buffer.from(fileData.content, "base64").toString();
      const parsedContent = JSON.parse(decodedContent);

      return {
        statusCode: 200,
        body: JSON.stringify({ imagenes: parsedContent }),
      };
    }

    if (event.httpMethod === "POST") {
      // Manejar solicitudes POST para actualizar data.json
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "El cuerpo de la solicitud está vacío." }),
        };
      }

      const parsedBody = JSON.parse(event.body);

      if (!parsedBody.imagenes || !Array.isArray(parsedBody.imagenes)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "El campo 'imagenes' debe ser un array válido.",
          }),
        };
      }

      const imagenesFormateadas = parsedBody.imagenes.map((imagen) => ({
        src: imagen.url || imagen.src || "",
        titulo: imagen.title || imagen.titulo || "",
      }));

      const { data: fileData } = await axios.get(dataJsonUrl, { headers });
      const sha = fileData.sha;

      const nuevoContenido = Buffer.from(
        JSON.stringify(imagenesFormateadas, null, 2)
      ).toString("base64");

      await axios.put(
        dataJsonUrl,
        {
          message: "Actualizar galería",
          content: nuevoContenido,
          sha: sha,
        },
        { headers }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, mensaje: "Galería actualizada correctamente." }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido." }),
    };
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error interno al procesar la solicitud.",
        details: error.message,
      }),
    };
  }
};