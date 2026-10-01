# HealthSync AI Integration Update

This version keeps the existing HealthSync core and ASP appointment scheduling module, while expanding the AI layer.

## Added AI features
- AI Health Assistant using local Ollama
- AI Health Insights: summarizes authorized medications, adherence, vitals and appointments
- AI Medication Coach: reviews adherence, missed/pending doses and stock concerns
- AI Vital Trend Analyst: identifies patterns/repeated unusual recorded readings for clinician review
- AI Symptom Support: organizes user-reported symptoms and highlights red-flag situations without diagnosing

## AI architecture
- Generative AI: Ollama local LLM (`OLLAMA_MODEL` configurable in `.env`)
- Backend: Node.js + Express API endpoints under `/api/ai/*`
- Existing ASP + Clingo optimizer remains available for appointment scheduling
- Existing medication-adherence module remains available
- The desktop AI panel shows the authorized patient's adherence, alerts,
  latest vitals, medications, appointments, and escalation state.
- `/api/ai/context` supplies role-authorized dashboard context. Record-based
  answers are grounded in PostgreSQL data available to the signed-in role.

## Run local AI
1. Install Ollama from its official open-source distribution.
2. Pull a local model, for example: `ollama pull llama3.2:3b`
3. Start Ollama.
4. In `backend/.env`, configure:
   `OLLAMA_URL=http://localhost:11434`
   `OLLAMA_MODEL=llama3.2:3b`
5. Install dependencies in `backend/` and `frontend/`.
6. Start each application from its own directory, or run
   `node scripts/dev-all.mjs` from the repository root.

If Ollama is unavailable, the AI endpoints use safe deterministic fallback summaries so the application remains usable.

## Safety
The AI features are designed as decision-support/education features. They do not diagnose conditions, prescribe medication, or change treatment plans.

For Windows environments where `localhost` resolves to IPv6 unexpectedly,
`OLLAMA_URL=http://127.0.0.1:11434` may be used in the private backend
environment file.
