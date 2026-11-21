import { Router } from "express";
import { db } from "../db/conexao.js";
import { mapearPergunta } from "../db/mapeadores.js";

export const perguntasRouter = Router();

const buscarPerguntas = db.prepare(
  "SELECT * FROM perguntas ORDER BY ordem ASC",
);

// GET /api/perguntas — lista as perguntas frequentes do acordeão de Preços.
perguntasRouter.get("/", (req, res, next) => {
  try {
    const perguntas = buscarPerguntas.all().map(mapearPergunta);
    res.json(perguntas);
  } catch (erro) {
    next(erro);
  }
});
