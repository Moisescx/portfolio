const axios = require("axios");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método no permitido. Usa POST." }),
      };
    }

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

    const dataJsonUrl =
      "https://api.github.com/repos/Moisescx/portfolio/contents/img/galeria/data.json";

    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };

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
