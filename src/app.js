import cors from "cors";
import express from "express";

import { autenticarApiKey } from "./middlewares/autenticarApiKey.js";
import { logger } from "./middlewares/logger.js";
import { naoEncontrado } from "./middlewares/naoEncontrado.js";
import { tratarErro } from "./middlewares/tratarErro.js";
import { authRouter } from "./routes/auth.js";
import { contatoRouter } from "./routes/contato.js";
import { depoimentosRouter } from "./routes/depoimentos.js";
import { perguntasRouter } from "./routes/perguntas.js";
import { planosRouter } from "./routes/planos.js";

export function criarApp() {
  const app = express();

  app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
  app.use(express.json());
  app.use(logger);

  // Health check público
  app.get("/", (req, res) => {
    res.json({ servico: "fluxo-api", status: "no ar" });
  });

  app.use("/api/auth", authRouter);

  // Rotas que exigem x-api-key.
  app.use("/api", autenticarApiKey);

  app.use("/api/planos", planosRouter);
  app.use("/api/depoimentos", depoimentosRouter);
  app.use("/api/perguntas", perguntasRouter);
  app.use("/api/contato", contatoRouter);

  app.use(naoEncontrado);
  app.use(tratarErro);

  return app;
}
