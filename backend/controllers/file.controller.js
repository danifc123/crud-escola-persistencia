const File = require("../models/file.model");
const path = require("path");
const fs = require("fs");

const uploadFileWithPathToMongo = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send({
        success: false,
        message: "Nenhum arquivo foi enviado.",
      });
    }

    const file = req.files.file;
    const uploadDir = path.join(__dirname, "../uploads"); // Pasta de uploads
    const filePath = path.join(uploadDir, file.name);

    // Garante que a pasta de uploads existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Salva o arquivo localmente
    await file.mv(filePath);

    // Salva o caminho no MongoDB
    const newFile = new File({
      name: file.name,
      path: filePath,
      uploadedAt: new Date(),
    });

    const savedFile = await newFile.save();

    res.status(200).send({
      success: true,
      message: "Arquivo enviado e caminho salvo no banco com sucesso!",
      fileId: savedFile._id,
    });
  } catch (error) {
    console.error("Erro ao salvar arquivo local e no MongoDB:", error.message);
    res.status(500).send({
      success: false,
      message: "Erro ao salvar arquivo",
      error: error.message,
    });
  }
};

const downloadFileFromPathInMongo = async (req, res) => {
  try {
    const fileId = req.params.id;

    // Busca o caminho do arquivo no MongoDB
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send({
        success: false,
        message: "Arquivo não encontrado.",
      });
    }

    // Envia o arquivo como resposta
    res.download(file.path, file.name);
  } catch (error) {
    console.error("Erro ao baixar arquivo pelo caminho:", error.message);
    res.status(500).send({
      success: false,
      message: "Erro ao baixar o arquivo",
      error: error.message,
    });
  }
};

module.exports = { uploadFileWithPathToMongo, downloadFileFromPathInMongo };
