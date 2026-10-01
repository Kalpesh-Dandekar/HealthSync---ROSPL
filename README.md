# HealthSync

**Caregiver-inclusive medication adherence and remote monitoring platform**

HealthSync connects patients, caregivers, and physicians through shared medication, vital-sign, appointment, alert, report, and care-network workflows.

## Repository structure

```text
frontend/   React, TypeScript, Vite, Tailwind CSS
backend/    Express, Prisma, PostgreSQL, Socket.IO
docs/       Technical notes and preserved implementation history
scripts/    Project-wide development utilities
```

## Roles

| Role | Main workspace |
|---|---|
| Patient | Medications, vitals, appointments, records, reports, care network, and emergency SOS |
| Caregiver | Connected patients, medication monitoring, alerts, appointments, reports, and care notes |
| Physician | Connected patients, clinical updates, appointments, reports, and emergency log |

## Frontend

```bash
cd frontend
npm ci
npm run dev
```

The frontend environment template is `frontend/.env.example`.

## Backend

See [`backend/README.md`](backend/README.md) for the complete PostgreSQL, environment, Prisma migration, and startup workflow.

The short version, after configuring the ignored `backend/.env`, is:

```bash
cd backend
npm ci
npm run prisma:deploy
npm run prisma:generate
npm run dev
```

The database-aware health endpoint is `http://localhost:5000/api/health`.

## Run both applications

After installing dependencies independently in `frontend/` and `backend/`, run this from the repository root:

```bash
node scripts/dev-all.mjs
```

Optional local AI setup is available through `scripts/setup-ai.ps1`. Technical notes are organized under `docs/`.
