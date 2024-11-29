const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "./idyllic-adviser-443212-p7-0694283e713d.json"
  ), // Corrija o caminho aqui
});

const bucketName = "crud-escola-will"; // Nome do seu bucket
const bucket = storage.bucket(bucketName);

module.exports = bucket;
