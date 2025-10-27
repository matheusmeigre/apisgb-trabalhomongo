const Author = require("../models/Author");

async function authorRoutes(fastify, options) {
  // POST /authors - Cadastrar Autor
  fastify.post("/authors", async (request, reply) => {
    try {
      const { name, birthDate, sex, writingGenre } = request.body;

      // Validações básicas
      if (!name || !birthDate || !sex || !writingGenre) {
        return reply.status(400).send({
          error:
            "Todos os campos são obrigatórios: name, birthDate, sex, writingGenre",
        });
      }

      // Validar gênero de escrita
      const validGenres = [
        "Novel",
        "Poetry",
        "Fantasy",
        "Fiction",
        "Mystery",
        "Suspense",
      ];
      if (!validGenres.includes(writingGenre)) {
        return reply.status(400).send({
          error: `Gênero de escrita inválido. Deve ser um dos seguintes: ${validGenres.join(
            ", "
          )}`,
        });
      }

      // Verificar se já existe um autor com o mesmo nome
      const existingAuthor = await Author.findOne({ name });
      if (existingAuthor) {
        return reply.status(409).send({
          error: "Já existe um autor cadastrado com este nome",
        });
      }

      // Criar novo autor
      const author = new Author({
        name,
        birthDate: new Date(birthDate),
        sex,
        writingGenre,
      });

      await author.save();

      return reply.status(201).send({
        message: "Autor cadastrado com sucesso",
        author: {
          id: author._id,
          name: author.name,
          birthDate: author.birthDate,
          sex: author.sex,
          writingGenre: author.writingGenre,
        },
      });
    } catch (error) {
      console.error("Erro ao cadastrar autor:", error);
      return reply.status(500).send({
        error: "Erro interno do servidor",
      });
    }
  });

  // GET /authors - Listar todos os autores
  fastify.get("/authors", async (request, reply) => {
    try {
      const authors = await Author.find({}).select("-__v");

      return reply.send({
        message: "Autores listados com sucesso",
        count: authors.length,
        authors,
      });
    } catch (error) {
      console.error("Erro ao listar autores:", error);
      return reply.status(500).send({
        error: "Erro interno do servidor",
      });
    }
  });
}

module.exports = authorRoutes;
