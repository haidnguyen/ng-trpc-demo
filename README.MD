# Setup database with postgreSQL

You can use docker or install PostgreSQL on your machine then update the connection string in .env file (there is a .env.example file use can edit and remove .example extension)

then run this command to migrate data

```bash
npx prisma migrate dev --name init
```

# Install dependencies

```bash
npm install
```

# Start Web

```bash
npm run start web
```

# Start Server

```bash
npm run start server
```
