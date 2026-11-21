import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
 
const scrypt = promisify(scryptCallback);
const TAMANHO_HASH = 64;
 
export async function gerarHashSenha(senhaTextoPuro) {
  const salt = randomBytes(16).toString("hex");
  const chave = await scrypt(senhaTextoPuro, salt, TAMANHO_HASH);
  return `${salt}:${chave.toString("hex")}`;
}
 
export async function verificarSenha(senhaTextoPuro, hashGravado) {
  const [salt, hashHex] = hashGravado.split(":");
  const chaveEsperada = Buffer.from(hashHex, "hex");
  const chaveRecebida = await scrypt(senhaTextoPuro, salt, TAMANHO_HASH);
  return timingSafeEqual(chaveEsperada, chaveRecebida);
}
