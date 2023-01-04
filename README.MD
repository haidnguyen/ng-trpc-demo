# Install dependencies

```bash
npm install
```

# Setup database with postgreSQL

You can use docker or install PostgreSQL on your machine then update the connection string in .env file (there is a .env.example file you can edit and remove .example extension)

then run this command to migrate data

```bash
npm run db:migrate
```

# Start Web

```bash
npm run start web
```

# Start Server

```bash
npm run start server
```
