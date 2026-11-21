// Roda quando nenhuma rota acima respondeu à requisição.
export function naoEncontrado(req, res) {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
}
