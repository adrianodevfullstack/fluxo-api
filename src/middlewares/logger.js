// Middleware de log bem simples
export function logger(req, res, next) {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracaoMs = Date.now() - inicio;
    const consumidor = req.consumidorApi ?? "anonimo";
    console.log(
      `[${consumidor}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duracaoMs}ms)`,
    );
  });

  next();
}
