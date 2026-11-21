import { Router } from "express";
import { db } from "../db/conexao.js";
import { mapearPlano } from "../db/mapeadores.js";

export const planosRouter = Router();

const buscarPlanos = db.prepare("SELECT * FROM planos ORDER BY ordem ASC");

// GET /api/planos — lista os planos de preço
planosRouter.get("/", (req, res, next) => {
  try {
    const planos = buscarPlanos.all().map(mapearPlano);
    res.json(planos);
  } catch (erro) {
    next(erro);
  }
});
