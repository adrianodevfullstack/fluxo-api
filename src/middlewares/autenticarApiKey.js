import { timingSafeEqual } from "node:crypto";

// Protege as rotas sob /api contra chamadas de clientes não autorizados.
function carregarChaves() {
  const bruto = process.env.API_KEYS || "";
  return bruto
    .split(",")
    .filter(Boolean)
    .map((par) => {
      const [consumidor, chave] = par.split(":");
      return { consumidor, chave };
    });
}

const CHAVES = carregarChaves();

export function autenticarApiKey(req, res, next) {
  const chaveRecebida = req.get("x-api-key");

  if (!chaveRecebida) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Chave de API ausente ou inválida.",
    });
  }

  const encontrada = CHAVES.find((item) =>
    chavesIguais(chaveRecebida, item.chave),
  );

  if (!encontrada) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Chave de API ausente ou inválida.",
    });
  }

  // Disponível para o logger e para as rotas daqui pra frente.
  req.consumidorApi = encontrada.consumidor;
  next();
}

function chavesIguais(chaveRecebida, chaveEsperada) {
  const bufferRecebido = Buffer.from(chaveRecebida);
  const bufferEsperado = Buffer.from(chaveEsperada);

  if (bufferRecebido.length !== bufferEsperado.length) {
    return false;
  }

  return timingSafeEqual(bufferRecebido, bufferEsperado);
}
