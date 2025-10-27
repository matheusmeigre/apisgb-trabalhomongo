const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const mongoUrl =
        process.env.DATABASE_URL || "mongodb://localhost:27017/biblioteca";

      this.connection = await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("Conectado ao MongoDB com sucesso!");

      mongoose.connection.on("error", (error) => {
        console.error("Erro na conexão com MongoDB:", error);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("Desconectado do MongoDB");
      });
    } catch (error) {
      console.error("Erro ao conectar com MongoDB:", error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("Desconectado do MongoDB");
    } catch (error) {
      console.error("Erro ao desconectar do MongoDB:", error);
    }
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new Database();
