require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const database = require("./config/database");

// Registrar rotas
async function start() {
  try {
    await database.connect();

    await fastify.register(require("./routes/users"));
    await fastify.register(require("./routes/authors"));
    await fastify.register(require("./routes/books"));
    await fastify.register(require("./routes/loans"));

    // rota para health check
    fastify.get("/", async (request, reply) => {
      return {
        message: "API de Gerenciamento de Biblioteca",
        version: "1.0.0",
        endpoints: {
          users: ["GET /users", "POST /users"],
          authors: ["GET /authors", "POST /authors"],
          books: ["GET /books", "POST /books"],
          loans: ["POST /loans"],
        },
      };
    });

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });

    console.log(`Servidor rodando em http://localhost:${port}`);
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

// Tratamento para encerrar o servidor
process.on("SIGINT", async () => {
  console.log("\nEncerrando servidor...");
  try {
    await fastify.close();
    await database.disconnect();
    console.log("Servidor encerrado com sucesso");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao encerrar servidor:", error);
    process.exit(1);
  }
});

start();
