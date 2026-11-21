import { Router } from "express";
import { db } from "../db/conexao.js";
import { validarContato } from "../utils/validarContato.js";

export const contatoRouter = Router();

const inserirMensagem = db.prepare(`
  INSERT INTO mensagens_contato (nome, email, empresa, mensagem)
  VALUES (?, ?, ?, ?)
`);

// POST /api/contato
contatoRouter.post("/", (req, res, next) => {
  try {
    const valores = req.body ?? {};
    const erros = validarContato(valores);

    if (Object.keys(erros).length > 0) {
      return res.status(400).json({ sucesso: false, erros });
    }

    inserirMensagem.run(
      valores.nome.trim(),
      valores.email.trim(),
      valores.empresa?.trim() || null,
      valores.mensagem.trim(),
    );

    res.status(201).json({
      sucesso: true,
      mensagem:
        "Mensagem recebida! Alguém do nosso time vai responder em até 1 dia útil.",
    });
  } catch (erro) {
    next(erro);
  }
});
