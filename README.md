# HealthSync

**Caregiver-inclusive medication adherence & remote monitoring platform**
*ITL704 — Recent Open Source Project Lab*

## What this is

Most medication-adherence apps talk to one person: the patient. HealthSync is
built around a different premise — that an informal caregiver (a daughter, a
spouse, a home health aide) is often the one actually managing medication,
and that they are left guessing whether a dose was taken. HealthSync closes
that loop: every dose, vital reading, appointment, and note is visible in
real time to the patient, their caregiver, and their physician from one
shared record.

The product direction is grounded in three pieces of published research
(full citations in the project report):

- **Adhera** (Zhou, 2025) — a caregiver-inclusive medication adherence study
  that found caregivers experience real anxiety and sleep disruption from
  *not knowing* whether a dose was taken, and that most adherence tools are
  patient-only. HealthSync's real-time dose feed, caregiver dashboard, and
  "care network" note thread are a direct response to this.
- **The impact of EHRs on patient care and outcomes** (Adeniyi et al., 2024)
  — motivates the shared, standards-oriented health record and the
  physician view of adherence + vitals history.
- **mHealth applications for remote monitoring** (Jat & Grønli, 2023) —
  motivates the vitals trend view and the shift toward continuous,
  between-visit monitoring rather than snapshot-only checkups.

## Roles

| Role | What they see |
|---|---|
| **Patient** | Today's medicines, adherence ring, vitals trend, appointments, reports, health record, care network, Emergency SOS |
| **Caregiver** | Live dose feed, alerts, appointments, reports, care network |
| **Physician** | Patient panel, appointments, reports, emergency log, care network |

## Tech stack (all open source)

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS, `react-router-dom`, `lucide-react`
- **Backend:** Node.js + Express, PostgreSQL + Prisma, JWT auth, Socket.IO for real-time dose/alert sync
- **Frontend data layer:** `AppDataContext` now calls the Express API when the backend is available and falls back to demo data when it is offline. Socket.IO updates open role workspaces in real time.

## Getting started

Frontend only:

```bash
npm install
npm run dev
```

Full-stack local setup: see `BACKEND_SETUP.md`.

Open the app and pick a role (Patient / Caregiver / Physician) from the
landing screen — no login required in this prototype.

## Project structure

```
src/
  components/
    layout/AppShell.tsx      # shared sidebar + mobile nav shell, role-aware
    ui/                       # Card, Badge, AdherenceRing primitives
  api/
    healthsyncApi.ts           # REST + Socket.IO client
  data/
    mockData.ts                # fallback demo data
    AppDataContext.tsx         # API-backed state + real-time event bridge
server/
  index.js                     # Express + Socket.IO API
  prisma/schema.prisma         # PostgreSQL schema
  prisma/seed.js               # demo database seed
  pages/
    patient/  caregiver/  doctor/   # role-specific screens
    shared/                          # screens reused across roles (Care Network, Appointments, Reports)
```

## Roadmap

1. **Completed:** Express + PostgreSQL + Prisma persistence
2. **Completed:** Socket.IO real-time dose/alert/SOS/care-network sync
3. **Completed:** JWT + bcrypt demo authentication and role-aware API permissions
4. Next: FHIR-shaped export for Reports/Records
5. Next: connect the ML risk history to persisted multi-day dose events

## HealthSync backend

The backend is in `backend/` and uses PostgreSQL + Prisma + Express + JWT/bcrypt + Socket.IO.

From the project root:

```bash
npm install
npm run backend:install
```

Copy `backend/.env.example` to `backend/.env` and set your PostgreSQL password.

Then:

```bash
cd backend
npx prisma generate
npm run dev
```

If the `healthsync` database is new/empty, run `npx prisma migrate dev --name init` once. If you already migrated the database, do not migrate again.
