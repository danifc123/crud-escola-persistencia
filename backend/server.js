const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models/db");
const connectMongo = require("./config/mongo.config"); // Conexão com MongoDB
const { Storage } = require("@google-cloud/storage"); // Google Cloud Storage

const disciplinasController = require("../backend/controllers/disciplinasController");
const professoresController = require("../backend/controllers/professor.controller");
const turmasController = require("../backend/controllers/turma.controller");
const salasController = require("../backend/controllers/sala.controller.js");
const paginainIcialController = require("../backend/controllers/paginaInicial.controller.js");
const alunosController = require("./controllers/alunos.controller");
const turmasHasAlunosController = require("./controllers/turmasHasAlunos.controller");
const fileUpload = require("express-fileupload");
const Log = require("./models/log.model"); // Certifique-se de que o caminho está correto
const bucket = require("./config/gcs.config"); // Importa o bucket configurado
const fileController = require("./controllers/file.controller");

connectMongo();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(fileUpload());

app.get("/pagina-inicial", paginainIcialController.getInicio);
app.get(
  "/pagina-inicial/professor",
  paginainIcialController.getProfessorByName
);

app.get("/alunos", alunosController.getAlunos);
app.post("/alunos", alunosController.createAluno);
app.put("/alunos/:id", alunosController.updateAluno);
app.delete("/alunos/:id", alunosController.deleteAluno);
app.put("/alunos/:id/reativar", alunosController.reativarAluno);
app.get("/alunos/search", alunosController.searchAlunos);

app.get("/disciplinas", disciplinasController.getDisciplinas);
app.post("/disciplinas", disciplinasController.createDisciplina);
app.put("/disciplinas/:id", disciplinasController.updateDisciplina);
app.delete("/disciplinas/:id", disciplinasController.deleteDisciplina);
app.put("/disciplinas/:id/reativar", disciplinasController.reativarDisciplina);
app.get("/disciplinas/search", disciplinasController.searchDisciplinas);

app.get("/professores", professoresController.getProfessores);
app.post("/professores", professoresController.createProfessor);
app.put("/professores/:id", professoresController.updateProfessor);
app.delete("/professores/:id", professoresController.deleteProfessor);
app.put("/professores/:id/reativar", professoresController.reativarProfessor);
app.get("/professores/search", professoresController.searchProfessores);
app.post("/professores/log", professoresController.logActivity);

app.get("/turmas", turmasController.getTurmas);
app.post("/turmas", turmasController.createTurma);
app.put("/turmas/:id", turmasController.updateTurma);
app.delete("/turmas/:id", turmasController.deleteTurma);
app.put("/turmas/:id/reativar", turmasController.reativarTurma);
app.get("/turmas/search", turmasController.searchTurmas);

app.get("/salas", salasController.getSalas);
app.post("/salas", salasController.createSala);
app.put("/salas/:id", salasController.updateSala);
app.delete("/salas/:id", salasController.deleteSala);
app.put("/salas/:id/reativar", salasController.reativarSala);
app.get("/salas/search", salasController.searchSalas);

app.get("/turmas-has-alunos", turmasHasAlunosController.getTurmaHasAluno);
app.post(
  "/turmas-has-alunos/vinculo-aluno-turma",
  turmasHasAlunosController.adicionarTurmaHasAluno
);
app.delete(
  "/turmas-has-alunos/:id",
  turmasHasAlunosController.deleteTurmaHasAluno
);
app.get(
  "/turmas-has-alunos/search",
  turmasHasAlunosController.searchTurmasHasAlunos
);
app.put(
  "/turmas-has-alunos/:id",
  turmasHasAlunosController.updateTurmaHasAlunos
);

// mongoDB requisiçoes e google storage requisiçoes

app.post("/upload/mongo-path", fileController.uploadFile);
// app.get("/download/mongo-path/:id", fileController.downloadFileFromPathInMongo);

app.get("/professores/log", async (req, res) => {
  try {
    // Usando o modelo Log para buscar os logs
    const logs = await Log.find(); // Buscar todos os logs na coleção Log
    res.status(200).json(logs); // Retornar os logs em formato JSON
  } catch (error) {
    res.status(500).send("Erro ao buscar logs: " + error.message);
  }
});
app.delete("/professores/log/:id", async (req, res) => {
  try {
    const logId = req.params.id; // O ID do log a ser deletado
    const log = await Log.findByIdAndDelete(logId); // Deleta o log pelo ID

    if (!log) {
      return res.status(404).send("Log não encontrado"); // Se o log não for encontrado
    }

    res.status(200).send("Log deletado com sucesso!"); // Resposta de sucesso
  } catch (error) {
    res.status(500).send("Erro ao deletar log: " + error.message); // Se ocorrer um erro
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
