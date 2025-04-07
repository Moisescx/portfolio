const express = require('express');
const ogpParser = require('ogp-parser');
const app = express();
const port = 3000;

app.get('/preview', async (req, res) => {
  const url = req.query.url;
  try {
    const data = await ogpParser(url);
    res.json(data); // Devuelve la vista previa
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos OGP' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
