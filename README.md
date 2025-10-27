# API de Sistema de Gerenciamento de Biblioteca

Uma API RESTful para gerenciar o funcionamento de uma biblioteca, desenvolvida com Fastify e MongoDB.

## 🚀 Funcionalidades

- **Gerenciamento de Usuários**: Cadastro e listagem de usuários da biblioteca
- **Gerenciamento de Autores**: Cadastro e listagem de autores de livros
- **Gerenciamento de Livros**: Cadastro e listagem de livros com associação aos autores
- **Sistema de Empréstimos**: Controle completo de empréstimos com regras de negócio

## 🛠️ Tecnologias Utilizadas

- **Fastify**: Framework web rápido e eficiente
- **MongoDB**: Banco de dados não relacional
- **Mongoose**: ODM para modelagem de dados
- **Dotenv**: Gerenciamento de variáveis de ambiente

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/matheusmeigre/apisgb-trabalhomongo.git
cd trabalho-apisgb
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL=mongodb://localhost:27017/biblioteca
PORT=3000
NODE_ENV=development
```

## 🚀 Como executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Limpar collections do banco
```bash
npm run collections
```

## 📡 Endpoints da API

### Usuários
- `POST /users` - Cadastrar novo usuário
- `GET /users` - Listar todos os usuários

### Autores
- `POST /authors` - Cadastrar novo autor
- `GET /authors` - Listar todos os autores

### Livros
- `POST /books` - Cadastrar novo livro
- `GET /books` - Listar todos os livros

### Empréstimos
- `POST /loans` - Realizar empréstimo

## 📊 Modelos de Dados

### Usuário (Users)
```json
{
  "name": "João Silva",
  "birthDate": "1990-05-15",
  "sex": "Masculino",
  "address": "Rua das Flores, 123, São Paulo - SP"
}
```

### Autor (Authors)
```json
{
  "name": "Machado de Assis",
  "birthDate": "1839-06-21",
  "sex": "Masculino",
  "writingGenre": "Fiction"
}
```

### Livro (Books)
```json
{
  "title": "Dom Casmurro",
  "synopsis": "Romance clássico da literatura brasileira...",
  "year": 1899,
  "author": "ObjectId_do_autor"
}
```

### Empréstimo (Loans)
```json
{
  "bookId": "ObjectId_do_livro",
  "userId": "ObjectId_do_usuario"
}
```

## 📝 Regras de Negócio

### Empréstimos
1. O livro deve estar disponível (`isAvailable: true`)
2. Se `isAvailable: false` mas `expectedReturnDate` é anterior à data atual, o empréstimo é permitido
3. Quando empréstimo é realizado:
   - `isAvailable` torna-se `false`
   - `expectedReturnDate` é definido para 3 dias a partir da data atual
   - Registro é criado na coleção `Loans`
4. Se livro não disponível, empréstimo é negado

### Validações
- Nomes de usuários e autores devem ser únicos
- Gêneros de escrita válidos: Novel, Poetry, Fantasy, Fiction, Mystery, Suspense
- Todos os campos obrigatórios devem ser preenchidos

## 🧪 Testes

Utilize o arquivo `routes.http` para testar todos os endpoints da API com exemplos práticos.

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── database.js      # Configuração do MongoDB
├── models/
│   ├── Author.js        # Schema dos autores
│   ├── Book.js          # Schema dos livros
│   ├── Loan.js          # Schema dos empréstimos
│   └── User.js          # Schema dos usuários
├── routes/
│   ├── authors.js       # Rotas dos autores
│   ├── books.js         # Rotas dos livros
│   ├── loans.js         # Rotas dos empréstimos
│   └── users.js         # Rotas dos usuários
└── app.js               # Arquivo principal da aplicação
scripts/
└── collections.js       # Script para limpar collections
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

**Matheus Meigre**

- GitHub: [@matheusmeigre](https://github.com/matheusmeigre)

---

⭐️ Se este projeto te ajudou, deixe uma estrela!