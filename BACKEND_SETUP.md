# HealthSync Backend Setup

Backend folder: `backend/`

Stack: Node.js + Express + PostgreSQL + Prisma + JWT + bcrypt + Socket.IO.

## Install

From project root:

```bash
npm install
npm run backend:install
```

Then copy:

`backend/.env.example` → `backend/.env`

Set `DATABASE_URL` for an empty local PostgreSQL database and replace the
`JWT_SECRET` placeholder with a unique random value of at least 32 characters.

## Prisma

```bash
cd backend
npm run prisma:deploy
npm run prisma:generate
```

Use `npm run prisma:migrate -- --name descriptive_name` only when intentionally
changing the Prisma schema and creating a new development migration. See
`backend/README.md` for the complete environment contract and setup workflow.

## Start

Backend:

```bash
cd backend
npm run dev
```

Frontend, in another terminal from the project root:

```bash
npm run dev
```

Backend health check:

`http://localhost:5000/api/health`


## Cross-role care team demo

Caregiver and physician accounts must be connected to a patient before they can see that patient's records. You can connect them from each role's **Patients** page or **Care Network** page by entering the patient's HealthSync email. The backend merges the caregiver and physician connections so all three authorized roles see the same care team.

For an existing demo database, an optional helper is available:

```bash
node backend/scripts/link-first-care-team.js
```

It connects the first PATIENT account to the first CAREGIVER and first PHYSICIAN account. Use this only for demo/test data.
