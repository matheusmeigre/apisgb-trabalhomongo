const Loan = require("../models/Loan");
const Book = require("../models/Book");
const User = require("../models/User");

async function loanRoutes(fastify, options) {
  // POST /loans - Realizar Empréstimo
  fastify.post("/loans", async (request, reply) => {
    try {
      const { bookId, userId } = request.body;

      if (!bookId || !userId) {
        return reply.status(400).send({
          error: "Os campos bookId e userId são obrigatórios",
        });
      }

      // Usuario existente/inexistente
      const user = await User.findById(userId);
      if (!user) {
        return reply.status(404).send({
          error: "Usuário não encontrado",
        });
      }

      // Livro existente/inexistente
      const book = await Book.findById(bookId).populate("author", "name");
      if (!book) {
        return reply.status(404).send({
          error: "Livro não encontrado",
        });
      }
      //Regras de negócio para verificar disponibilidade do livro
      const currentDate = new Date();

      if (book.isAvailable) {
        // Livro disponível - pode realizar o empréstimo
        return await processLoan(book, user, currentDate, reply);
      }

      if (!book.isAvailable && book.expectedReturnDate) {
        const expectedReturn = new Date(book.expectedReturnDate);

        if (expectedReturn < currentDate) {
          // O prazo de devolução expirou - pode realizar o empréstimo
          return await processLoan(book, user, currentDate, reply);
        }
      }

      return reply.status(409).send({
        error: "Livro não está disponível para empréstimo",
        details: {
          title: book.title,
          isAvailable: book.isAvailable,
          expectedReturnDate: book.expectedReturnDate,
        },
      });
    } catch (error) {
      console.error("Erro ao processar empréstimo:", error);
      return reply.status(500).send({
        error: "Erro interno do servidor",
      });
    }
  });

  // Função auxiliar para processar o empréstimo
  async function processLoan(book, user, currentDate, reply) {
    try {
      // Data de devolução = 3 dias a partir da data atual
      const returnDate = new Date(currentDate);
      returnDate.setDate(returnDate.getDate() + 3);

      // Criar registro de empréstimo
      const loan = new Loan({
        user: user.name,
        book: book.title,
        loanDate: currentDate.toISOString().split("T")[0], // YYYY-MM-DD
        returnDate: returnDate.toISOString().split("T")[0], // YYYY-MM-DD
      });

      await loan.save();

      // Atualizar status do livro
      book.isAvailable = false;
      book.expectedReturnDate = returnDate;
      await book.save();

      return reply.status(201).send({
        message: "Empréstimo realizado com sucesso",
        loan: {
          id: loan._id,
          user: loan.user,
          book: loan.book,
          loanDate: loan.loanDate,
          returnDate: loan.returnDate,
        },
        bookStatus: {
          id: book._id,
          title: book.title,
          isAvailable: book.isAvailable,
          expectedReturnDate: book.expectedReturnDate,
        },
      });
    } catch (error) {
      console.error("Erro ao processar empréstimo:", error);
      throw error;
    }
  }
}

module.exports = loanRoutes;
