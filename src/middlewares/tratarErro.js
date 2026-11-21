// Middleware de erro: o Express reconhece pela assinatura de 4
// parâmetros (err, req, res, next) e só chama este em caso de exceção.
export function tratarErro(erro, req, res, next) {
  console.error(erro);
  res.status(500).json({
    sucesso: false,
    mensagem: "Erro interno no servidor. Tente novamente em instantes.",
  });
}
