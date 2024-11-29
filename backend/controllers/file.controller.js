const bucket = require("../config/gcs.config");
const path = require("path");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Nenhum arquivo enviado.");

    const filePath = req.file.path; // Caminho local do arquivo enviado
    const destination = `uploads/${req.file.originalname}`; // Destino no bucket

    await bucket.upload(filePath, { destination });
    res.status(200).send(`Arquivo enviado com sucesso para ${destination}!`);
  } catch (error) {
    res.status(500).send("Erro ao fazer upload: " + error.message);
  }
};

module.exports = { uploadFile };
