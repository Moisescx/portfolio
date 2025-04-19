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
        body: JSON.stringify(parsedContent), // Devuelve el contenido directamente
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