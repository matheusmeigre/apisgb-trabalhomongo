require("dotenv").config();
const mongoose = require("mongoose");

// Importar modelos para garantir que as collections sejam criadas
const Author = require("../src/models/Author");
const User = require("../src/models/User");
const Book = require("../src/models/Book");
const Loan = require("../src/models/Loan");

async function resetCollections() {
  try {
    console.log("🔄 Iniciando reset das collections...");

    // Conectar ao MongoDB
    const mongoUrl =
      process.env.DATABASE_URL || "mongodb://localhost:27017/biblioteca";
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conectado ao MongoDB");

    // Listar todas as collections existentes
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`📋 Collections encontradas: ${collections.length}`);

    // Excluir todas as collections
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`🗑️  Removendo collection: ${collectionName}`);
      await mongoose.connection.db.dropCollection(collectionName);
    }

    console.log("✅ Todas as collections foram removidas");

    // Recriar as collections vazias
    console.log("🔄 Recriando collections vazias...");

    // Criar collections vazias para garantir que existam
    await mongoose.connection.db.createCollection("Authors");
    await mongoose.connection.db.createCollection("Users");
    await mongoose.connection.db.createCollection("Books");
    await mongoose.connection.db.createCollection("Loans");

    console.log("✅ Collections recriadas com sucesso:");
    console.log("   - Authors (Autores)");
    console.log("   - Users (Usuários)");
    console.log("   - Books (Livros)");
    console.log("   - Loans (Empréstimos)");

    // Verificar se as collections foram criadas
    const newCollections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`📋 Total de collections após reset: ${newCollections.length}`);

    console.log("🎉 Reset das collections concluído com sucesso!");
    console.log(
      "💡 Todas as collections estão agora vazias e prontas para uso."
    );
  } catch (error) {
    console.error("❌ Erro durante o reset das collections:", error);
  } finally {
    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log("🔌 Desconectado do MongoDB");
    process.exit(0);
  }
}

// Executar o script
console.log("🚀 Iniciando script de reset das collections...");
console.log(
  "⚠️  ATENÇÃO: Este script irá APAGAR TODOS OS DADOS das collections!"
);
console.log("");

resetCollections();
