const User = require("../models/User");

async function userRoutes(fastify, options) {
  // POST /users - Cadastrar Usuário
  fastify.post("/users", async (request, reply) => {
    try {
      const { name, birthDate, sex, address } = request.body;

      // Validações básicas
      if (!name || !birthDate || !sex || !address) {
        return reply.status(400).send({
          error:
            "Todos os campos são obrigatórios: name, birthDate, sex, address",
        });
      }

      // Verificar se já existe um usuário com o mesmo nome
      const existingUser = await User.findOne({ name });
      if (existingUser) {
        return reply.status(409).send({
          error: "Já existe um usuário cadastrado com este nome",
        });
      }

      // Criar novo usuário
      const user = new User({
        name,
        birthDate: new Date(birthDate),
        sex,
        address,
      });

      await user.save();

      return reply.status(201).send({
        message: "Usuário cadastrado com sucesso",
        user: {
          id: user._id,
          name: user.name,
          birthDate: user.birthDate,
          sex: user.sex,
          address: user.address,
        },
      });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return reply.status(500).send({
        error: "Erro interno do servidor",
      });
    }
  });

  // GET /users - Listar todos os usuários
  fastify.get("/users", async (request, reply) => {
    try {
      const users = await User.find({}).select("-__v");

      return reply.send({
        message: "Usuários listados com sucesso",
        count: users.length,
        users,
      });
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return reply.status(500).send({
        error: "Erro interno do servidor",
      });
    }
  });
}

module.exports = userRoutes;
