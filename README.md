# fluxo-api — API REST em Node.js + Express (aplicação da atividade guiada)

API completa e funcional construída seguindo, passo a passo, as atividades
**"Construindo uma API REST em Node.js com Express"**
(`Aula_API_NodeJS_Express_Laboratorio.docx`) e
**"Autenticação por chave de API"** (`Aula_ChaveAPI_Atividade_Laboratorio.docx`).
Persiste dados com o módulo SQLite nativo do Node (`node:sqlite`) — sem
nenhum ORM —, expõe rotas REST que servem exatamente os dados que o
front-end do Fluxo usa (planos, depoimentos, perguntas frequentes e
formulário de contato), e protege toda a superfície `/api/*` com uma
chave de API enviada no cabeçalho `x-api-key` — uma chave por consumidor
(app mobile, parceiro de relatórios etc.), para permitir identificar e
revogar o acesso de cada um individualmente.

Fluxo é um produto fictício, criado só para fins didáticos.

## Rodando localmente

Requer Node.js 22 ou superior (necessário para `node:sqlite`).

```bash
npm install
npm run seed   # popula o banco com os dados de exemplo
npm run dev    # ou: npm start
```

O servidor sobe em http://localhost:4000 (porta configurável em `.env`).
O `.env` já vem com duas chaves de exemplo (`app-mobile` e
`parceiro-relatorios`) prontas para uso local — gerem chaves próprias
antes de usar isto fora do seu computador:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

## Testando as rotas

Toda rota sob `/api/*` exige o cabeçalho `x-api-key` com uma das chaves
listadas em `API_KEYS` no `.env` (formato `consumidor:chave`, separadas
por vírgula). `GET /` é a exceção: fica público, só para checar que o
servidor está no ar.

```bash
curl http://localhost:4000/
# -> 200, sem precisar de chave

curl http://localhost:4000/api/planos
# -> 401, sem a chave

curl -H "x-api-key: CHAVE_DO_APP_MOBILE" http://localhost:4000/api/planos
curl -H "x-api-key: CHAVE_DO_PARCEIRO" http://localhost:4000/api/depoimentos
curl -H "x-api-key: CHAVE_DO_APP_MOBILE" http://localhost:4000/api/perguntas
# -> qualquer chave válida libera o acesso; o consumidor correspondente
#    fica disponível em req.consumidorApi dentro da aplicação

curl -X POST http://localhost:4000/api/contato \
  -H "x-api-key: CHAVE_DO_APP_MOBILE" \
  -H "Content-Type: application/json" \
  -d '{"nome":"","email":"invalido","mensagem":"oi"}'
# -> 400, com um erro por campo

curl -X POST http://localhost:4000/api/contato \
  -H "x-api-key: CHAVE_DO_APP_MOBILE" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana","email":"ana@exemplo.com","mensagem":"Quero saber mais sobre o Profissional"}'
# -> 201, mensagem gravada no banco

curl -H "x-api-key: CHAVE_INVALIDA" http://localhost:4000/api/planos
# -> 401, chave não reconhecida

curl -H "x-api-key: CHAVE_DO_APP_MOBILE" http://localhost:4000/api/rota-que-nao-existe
# -> 404, tratado pelo middleware naoEncontrado (a chave era válida, a
#    rota que não existe)
```

Cada requisição também aparece logada no terminal do servidor
(`GET /api/planos → 200 (4ms)`).

## Estrutura

```
fluxo-api/
  .env                     // PORT, DATABASE_URL, FRONTEND_ORIGIN, API_KEYS
  package.json             // "type": "module"
  server.js                // app.listen — só sobe a porta
  src/
    app.js                 // criarApp(): monta middlewares e rotas
    db/
      esquema.sql          // CREATE TABLE das 4 tabelas
      conexao.js           // DatabaseSync + aplica o esquema
      mapeadores.js        // snake_case -> camelCase
      seed.js              // popula o banco com dados de exemplo
    routes/
      planos.js            // GET /api/planos
      depoimentos.js       // GET /api/depoimentos
      perguntas.js         // GET /api/perguntas
      contato.js           // POST /api/contato
    middlewares/
      logger.js            // log de cada requisição
      autenticarApiKey.js  // exige x-api-key em tudo sob /api
      naoEncontrado.js     // handler de 404
      tratarErro.js        // handler de erro (4 parâmetros)
    utils/
      validarContato.js    // mesma regra do front-end, no servidor
```

A ordem dos `app.use()` em `src/app.js` importa: `cors` e `express.json`
vêm antes das rotas (toda rota depende deles), `autenticarApiKey` vem logo
antes dos roteadores (só protege o que vem depois dele), `naoEncontrado`
vem depois de todas as rotas, e `tratarErro` é sempre o último.

## Integração com o front-end

Esta API é independente do projeto Fluxo (front-end) — para consumi-la de
verdade, rode os dois ao mesmo tempo (o front-end em `http://localhost:3000`
por padrão, conforme `FRONTEND_ORIGIN` em `.env`) e aponte o front-end para
`http://localhost:4000` via `NEXT_PUBLIC_API_URL`.
