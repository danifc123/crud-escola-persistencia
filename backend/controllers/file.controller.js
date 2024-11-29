const bucket = require("../config/gcs.config"); // Importa o bucket configurado
const mongoose = require("mongoose"); // Importa o Mongoose para interagir com o MongoDB
const File = require("../models/file.model"); // Modelo do arquivo (salvando o caminho no MongoDB)

const uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Nenhum arquivo enviado.");
    }

    const file = req.files.file; // O arquivo enviado na requisição
    const blob = bucket.file(file.name); // Define o arquivo no bucket
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      console.error("Erro no upload:", err.message);
      return res.status(500).send({
        success: false,
        message: "Erro ao fazer upload do arquivo",
        error: err.message,
      });
    });

    blobStream.on("finish", async () => {
      // Gerar URL pública do arquivo
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // Salvar a URL no MongoDB
      const newFile = new File({
        filename: file.name,
        fileUrl: publicUrl,
      });
      await newFile.save(); // Salva no MongoDB

      res.status(200).send({
        success: true,
        message: "Arquivo enviado e caminho salvo no banco com sucesso!",
        fileId: newFile._id, // Retorna o ID do arquivo armazenado
      });
    });

    // Envia o arquivo para o GCS
    blobStream.end(file.data);
  } catch (error) {
    console.error("Erro ao processar upload:", error.message);
    res.status(500).send({
      success: false,
      message: "Erro ao fazer upload do arquivo",
      error: error.message,
    });
  }
};

module.exports = { uploadFile };
