// O banco guarda colunas em snake_case (convenção do SQL); o front-end
// espera objetos em camelCase (convenção do JS). Essas funções fazem essa
// tradução em um único lugar, em vez de espalhar o mapeamento pelas rotas.
export function mapearPlano(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    descricao: linha.descricao,
    precoMensal: linha.preco_mensal,
    precoAnual: linha.preco_anual,
    destaque: Boolean(linha.destaque),
    recursos: JSON.parse(linha.recursos),
  };
}

export function mapearDepoimento(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    cargo: linha.cargo,
    texto: linha.texto,
  };
}

export function mapearPergunta(linha) {
  return {
    id: linha.id,
    pergunta: linha.pergunta,
    resposta: linha.resposta,
  };
}

export function mapearUsuario(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    papel: linha.papel,
  };
}
