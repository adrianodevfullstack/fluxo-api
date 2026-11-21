import { Router } from "express";
import { db } from "../db/conexao.js";
import { mapearDepoimento } from "../db/mapeadores.js";

export const depoimentosRouter = Router();

const buscarDepoimentos = db.prepare(
  "SELECT * FROM depoimentos ORDER BY ordem ASC",
);

// GET /api/depoimentos — lista os depoimentos do carrossel da Home.
depoimentosRouter.get("/", (req, res, next) => {
  try {
    const depoimentos = buscarDepoimentos.all().map(mapearDepoimento);
    res.json(depoimentos);
  } catch (erro) {
    next(erro);
  }
});
