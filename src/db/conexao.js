// node:sqlite é o módulo SQLite nativo do Node.js
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const caminhoBanco = process.env.DATABASE_URL
  ? resolve(process.cwd(), process.env.DATABASE_URL)
  : join(__dirname, "fluxo.db");

export const db = new DatabaseSync(caminhoBanco);

const esquema = readFileSync(join(__dirname, "esquema.sql"), "utf-8");
db.exec(esquema);
