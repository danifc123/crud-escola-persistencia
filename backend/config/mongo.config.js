const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    const uri =
      "mongodb+srv://danielcarmo29:fariadocarmo123@cluster0.oc0zb.mongodb.net/";
    await mongoose.connect(uri);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar no MongoDB:", err);
  }
};

module.exports = connectMongo;
