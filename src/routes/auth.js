import { Router } from "express";
import { db } from "../db/conexao.js";
import { verificarSenha } from "../utils/senha.js";
import { mapearUsuario } from "../db/mapeadores.js";
 
export const authRouter = Router();
 
const buscarUsuarioPorEmail = db.prepare(
  "SELECT * FROM usuarios WHERE email = ?",
);
 
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, senha } = req.body ?? {};
    if (!email || !senha) {
      return res.status(400).json({ erro: "Informe email e senha." });
    }
 
    const usuario = buscarUsuarioPorEmail.get(email.trim().toLowerCase());
    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }
 
    const senhaCorreta = await verificarSenha(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }
 
    res.json(mapearUsuario(usuario));
  } catch (erro) {
    next(erro);
  }
});
