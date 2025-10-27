const Book = require("../models/Book");
const Author = require("../models/Author");

async function bookRoutes(fastify, options) {
  // POST /books - Cadastrar um Livro
  fastify.post("/books", async (request, reply) => {
    try {
      const { title, synopsis, year, author } = request.body;

      // Validações básicas
      if (!title || !synopsis || !year || !author) {
        return reply.status(400).send({
          error:
            "Todos os campos são obrigatórios: title, synopsis, year, author",
        });
      }

      // Validar se o ano é um número válido
      if (isNaN(year) || year < 0) {
        return reply.status(400).send({
          error: "Ano deve ser um número válido",
        });
      }

      // Verificar se o autor existe
      const existingAuthor = await Author.findById(author);
      if (!existingAuthor) {
        return reply.status(404).send({
          error: "Autor não encontrado",
        });
      }

      // Criar novo livro
      const book = new Book({
        title,
        synopsis,
        year: parseInt(year),
        author,
        isAvailable: true,
        expectedReturnDate: null,
      });

      await book.save();

      // Buscar o livro com os dados do autor populados
      const savedBook = await Book.findById(book._id).populate(
        "author",
        "name writingGenre"
      );

      return reply.status(201).send({
        message: "Livro cadastrado com sucesso",
        book: {
          id: savedBook._id,
          title: savedBook.title,
          synopsis: savedBook.synopsis,
          year: savedBook.year,
          author: {
            id: savedBook.author._id,
            name: savedBook.author.name,
            writingGenre: savedBook.author.writingGenre,
          },
          isAvailable: savedBook.isAvailable,
          expectedReturnDate: savedBook.expectedReturnDate,
        },
      });
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error);
      return reply.status(500).send({
        error: "Erro interno do servidor",
      });
    }
  });

  // GET /books - Listar todos os livros
  fastify.get("/books", async (request, reply) => {
    try {
      const books = await Book.find({})
        .populate("author", "name writingGenre")
        .select("-__v");

      return reply.send({
        message: "Livros listados com sucesso",
        count: books.length,
        books,
      });
    } catch (error) {
      console.error("Erro ao listar livros:", error);
      return reply.status(500).send({
        error: "Erro interno do servidor",
      });
    }
  });
}

module.exports = bookRoutes;
