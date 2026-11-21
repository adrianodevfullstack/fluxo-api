// A MESMA regra de validação que o front-end já aplica em
// FormularioContato.jsx — nunca confie só na validação do cliente:
// qualquer pessoa pode chamar esta API diretamente, sem passar pelo
// formulário.
const EXPRESSAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarContato(valores) {
  const erros = {};

  if (!valores.nome || !valores.nome.trim()) {
    erros.nome = "Informe seu nome.";
  }

  if (!valores.email || !valores.email.trim()) {
    erros.email = "Informe seu e-mail.";
  } else if (!EXPRESSAO_EMAIL.test(valores.email)) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!valores.mensagem || valores.mensagem.trim().length < 10) {
    erros.mensagem = "Conte um pouco mais (pelo menos 10 caracteres).";
  }

  return erros;
}
