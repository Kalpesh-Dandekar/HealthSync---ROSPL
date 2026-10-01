# HealthSync Backend

Node.js, Express, PostgreSQL, Prisma, JWT, bcrypt, and Socket.IO.

## Prerequisites

- Node.js and npm
- A local PostgreSQL server
- An empty development database, such as `healthsync_dev`

## First-time setup

From the `backend` directory:

```bash
npm ci
```

Create an empty local database with PostgreSQL's `createdb` utility (or create
the same database in your PostgreSQL administration tool):

```bash
createdb healthsync_dev
```

Copy the environment template without committing the resulting `.env` file:

```powershell
Copy-Item .env.example .env
```

On macOS or Linux:

```bash
cp .env.example .env
```

Edit `.env` and set:

- `DATABASE_URL` to your local PostgreSQL database.
- `JWT_SECRET` to a unique random value of at least 32 characters. Do not reuse the example placeholder.

One way to generate a local secret is:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Apply the committed migrations and generate Prisma Client:

```bash
npm run prisma:deploy
npm run prisma:generate
```

Start the backend:

```bash
npm run dev
```

The database-aware health endpoint is available at:

```text
http://localhost:5000/api/health
```

It returns HTTP 200 only when PostgreSQL is reachable and HTTP 503 when the database is unavailable.

## Migration workflows

When intentionally changing the Prisma schema during development, create a new migration with:

```bash
npm run prisma:migrate -- --name descriptive_migration_name
```

To initialize a fresh database from migrations already committed to Git, use:

```bash
npm run prisma:deploy
```

`prisma migrate dev` creates development migrations. `prisma migrate deploy` only applies committed migrations and is the reproducible command for fresh or non-development environments.

## Optional integrations

- `OLLAMA_URL` and `OLLAMA_MODEL` configure local Ollama support. HealthSync continues with its built-in response fallback if Ollama is unavailable.
- Python and `clingo` enable the optional appointment solver. The JavaScript constraint fallback remains available when they are absent.

## Demo data

No seed data is required to start the backend. Users can register through the existing API. The optional `link-demo-team` script only links existing demo accounts and is not part of database initialization.
