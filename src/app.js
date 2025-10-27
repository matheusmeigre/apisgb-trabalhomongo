require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const database = require("./config/database");

// Registrar rotas
async function start() {
  try {
    // Conectar ao banco de dados
    await database.connect();

    // Registrar rotas
    await fastify.register(require("./routes/users"));
    await fastify.register(require("./routes/authors"));
    await fastify.register(require("./routes/books"));
    await fastify.register(require("./routes/loans"));

    // Rota raiz
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

    // Iniciar o servidor
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });

    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

// Manipular encerramento gracioso
process.on("SIGINT", async () => {
  console.log("\n🔄 Encerrando servidor...");
  try {
    await fastify.close();
    await database.disconnect();
    console.log("✅ Servidor encerrado com sucesso");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao encerrar servidor:", error);
    process.exit(1);
  }
});

start();
