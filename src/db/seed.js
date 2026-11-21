import { gerarHashSenha } from "../utils/senha.js";
import { db } from "./conexao.js";

const PLANOS = [
  {
    nome: "Essencial",
    descricao: "Para quem está começando a automatizar.",
    precoMensal: 97,
    precoAnual: 77,
    destaque: 0,
    ordem: 1,
    recursos: [
      "Até 5 fluxos ativos",
      "1.000 execuções por mês",
      "10 integrações disponíveis",
      "Suporte por e-mail",
    ],
  },
  {
    nome: "Profissional",
    descricao: "Para equipes que automatizam todos os dias.",
    precoMensal: 247,
    precoAnual: 197,
    destaque: 1,
    ordem: 2,
    recursos: [
      "Fluxos ilimitados",
      "20.000 execuções por mês",
      "Todas as integrações",
      "Aprovação em dupla",
      "Suporte prioritário no chat",
    ],
  },
  {
    nome: "Empresarial",
    descricao: "Para operações críticas em larga escala.",
    precoMensal: 697,
    precoAnual: 557,
    destaque: 0,
    ordem: 3,
    recursos: [
      "Tudo do Profissional",
      "Execuções ilimitadas",
      "SSO e trilha de auditoria completa",
      "Gerente de conta dedicado",
    ],
  },
];

const DEPOIMENTOS = [
  {
    nome: "Marina Alves",
    cargo: "Head de Operações, Lumen Varejo",
    texto:
      "Automatizamos em uma tarde um processo que consumia 6 horas por semana do time. O Fluxo substituiu três planilhas e um grupo de WhatsApp cheio de lembretes.",
    ordem: 1,
  },
  {
    nome: "Carlos Eduardo Pires",
    cargo: "CTO, Nimbus Pagamentos",
    texto:
      "A curva de aprendizado foi quase zero. Em uma semana já tínhamos os fluxos de aprovação de reembolso rodando sem nenhuma linha de código.",
    ordem: 2,
  },
  {
    nome: "Juliana Castro",
    cargo: "Gerente de Projetos, Átrio Consultoria",
    texto:
      "O que mais impressiona é a confiabilidade: nunca tivemos uma automação falhando silenciosamente. Os alertas chegam antes de qualquer cliente perceber.",
    ordem: 3,
  },
];

const PERGUNTAS = [
  {
    pergunta: "Preciso saber programar para usar o Fluxo?",
    resposta:
      "Não. Os fluxos são montados arrastando blocos visuais. Para casos avançados, é possível plugar uma função própria, mas isso é opcional.",
    ordem: 1,
  },
  {
    pergunta: "Posso cancelar quando quiser?",
    resposta:
      "Sim, o cancelamento pode ser feito a qualquer momento direto no painel, sem multa e sem precisar falar com o suporte.",
    ordem: 2,
  },
  {
    pergunta: "O que acontece se eu passar do limite de execuções?",
    resposta:
      "Você recebe um alerta por e-mail ao atingir 80% do limite do plano. Depois disso, pode comprar um pacote extra ou fazer upgrade de plano, sem perder nenhuma execução.",
    ordem: 3,
  },
  {
    pergunta: "Existe período de teste gratuito?",
    resposta:
      "Sim, todos os planos têm 14 dias de teste gratuito, sem necessidade de cartão de crédito.",
    ordem: 4,
  },
];

const USUARIOS = [
  {
    nome: "Ana Beatriz",
    email: "ana@fluxo.exemplo",
    senha: "fluxo123",
    papel: "admin",
  },
  {
    nome: "Rafael Souza",
    email: "rafael@fluxo.exemplo",
    senha: "fluxo123",
    papel: "usuario",
  },
];

db.exec("DELETE FROM mensagens_contato");
db.exec("DELETE FROM planos");
db.exec("DELETE FROM depoimentos");
db.exec("DELETE FROM perguntas");
db.exec("DELETE FROM usuarios");

const inserirPlano = db.prepare(`
  INSERT INTO planos (nome, descricao, preco_mensal, preco_anual, destaque, recursos, ordem)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
for (const plano of PLANOS) {
  inserirPlano.run(
    plano.nome,
    plano.descricao,
    plano.precoMensal,
    plano.precoAnual,
    plano.destaque,
    JSON.stringify(plano.recursos),
    plano.ordem,
  );
}

const inserirDepoimento = db.prepare(`
  INSERT INTO depoimentos (nome, cargo, texto, ordem) VALUES (?, ?, ?, ?)
`);
for (const depoimento of DEPOIMENTOS) {
  inserirDepoimento.run(
    depoimento.nome,
    depoimento.cargo,
    depoimento.texto,
    depoimento.ordem,
  );
}

const inserirPergunta = db.prepare(`
  INSERT INTO perguntas (pergunta, resposta, ordem) VALUES (?, ?, ?)
`);
for (const pergunta of PERGUNTAS) {
  inserirPergunta.run(pergunta.pergunta, pergunta.resposta, pergunta.ordem);
}

const inserirUsuario = db.prepare(`
  INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)
`);
for (const usuario of USUARIOS) {
  const senhaHash = await gerarHashSenha(usuario.senha);
  inserirUsuario.run(usuario.nome, usuario.email, senhaHash, usuario.papel);
}

console.log(
  `Seed concluído: ${PLANOS.length} planos, ${DEPOIMENTOS.length} depoimentos, ` +
    `${PERGUNTAS.length} perguntas, ${USUARIOS.length} usuarios`,
);
