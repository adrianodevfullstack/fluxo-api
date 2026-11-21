import "dotenv/config";
import { criarApp } from "./src/app.js";

const app = criarApp();
const porta = process.env.PORT || 4000;

app.listen(porta, () => {
  console.log(`fluxo-api rodando em http://localhost:${porta}`);
});
