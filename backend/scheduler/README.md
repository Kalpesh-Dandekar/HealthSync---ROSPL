# HealthSync ASP Appointment Scheduler

Open-source Answer Set Programming (ASP) appointment optimizer inspired by the supplied 2026 paper.

Install Clingo:

    pip install -r backend/scheduler/requirements.txt

The Node API sends appointment requests, availability, conflicts, urgency and patient preferences to `solve.py`. If Clingo is unavailable, HealthSync uses a local deterministic constraint-based fallback, so the rest of the application remains usable.
