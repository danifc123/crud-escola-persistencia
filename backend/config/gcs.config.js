const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "./config/idyllic-adviser-443212-p7-0694283e713d.json"
  ), // Caminho para o arquivo da chave
});

const bucketName = "crud-escola-will"; // Substitua pelo nome do bucket criado
const bucket = storage.bucket(bucketName);

module.exports = bucket;
