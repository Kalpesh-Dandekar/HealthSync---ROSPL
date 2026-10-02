import { Activity, AlertCircle, AlertTriangle, Bell, BrainCircuit, CalendarDays, Check, CheckCircle2, ChevronRight, HeartPulse, Pill, RefreshCw, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { AdherenceRing } from "../../components/ui/AdherenceRing";
import { RiskBadge } from "../../components/ui/RiskBadge";
import { useAppData } from "../../data/AppDataContext";
import type { DoseEvent } from "../../types";
import "./patient-dashboard.css";

function doseLabel(status: DoseEvent["status"], takenAt?: string) {
  if (status === "taken") return takenAt ? `Taken ${takenAt}` : "Taken";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function PatientDashboard() {
  const { patient, medicines, alerts, appointments, vitals, adherenceRate, logDose, sosActive, toggleSos, riskAssessment, isLoading, dataError, refreshPatientData } = useAppData();
  const riskPercent = Math.round(riskAssessment.overall.score * 100);
  const topRisk = [...riskAssessment.perMedicine].sort((a, b) => b.risk.score - a.risk.score)[0];
  const activeAlerts = alerts.filter((alert) => !alert.acknowledged);
  const upcomingAppointments = appointments.filter((appointment) => appointment.status === "upcoming");
  const nextAppointment = [...upcomingAppointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];
  const latestVital = vitals[0];
  const missed = medicines.reduce((count, medicine) => count + medicine.doses.filter((dose) => dose.status === "missed").length, 0);
  const pending = medicines.reduce((count, medicine) => count + medicine.doses.filter((dose) => dose.status === "pending" || dose.status === "scheduled").length, 0);
  const lowStock = medicines.filter((medicine) => medicine.stock <= medicine.lowStockThreshold).length;
  const connectedCareMembers = [patient.primaryCaregiver, patient.physician].filter((name) => name && name !== "Not connected");
  const firstName = patient.name.trim().split(" ")[0] || "there";

  if (!patient.id && (isLoading || !dataError)) return <div className="patient-overview patient-state" role="status"><RefreshCw className="h-7 w-7 animate-spin" /><div><h1>Preparing your workspace</h1><p>Loading your current health data securely.</p></div></div>;
  if (dataError && !patient.id) return <div className="patient-overview patient-state patient-state-error" role="alert"><AlertCircle className="h-7 w-7" /><div className="flex-1"><h1>We couldn’t load your workspace</h1><p>{dataError}</p></div><button onClick={() => void refreshPatientData()}><RefreshCw className="h-4 w-4" /> Try again</button></div>;

  return <div className="patient-overview">
    <header className="patient-hero">
      <div><div className="patient-eyebrow"><ShieldCheck className="h-3.5 w-3.5" /> Secure patient workspace</div><h1>{greeting()}, {firstName}</h1><p>Here’s your health overview for today.</p></div>
      <div className="patient-header-actions"><div className="patient-alert-indicator" aria-label={`${activeAlerts.length} active alerts`}><Bell className="h-4 w-4" /><span>{activeAlerts.length}</span></div><button onClick={toggleSos} className={`patient-sos ${sosActive ? "is-active" : ""}`}><AlertTriangle className="h-4 w-4" />{sosActive ? "SOS active" : "Emergency SOS"}</button></div>
    </header>

    {dataError && <div className="patient-inline-error" role="alert"><AlertCircle className="h-4 w-4" /> Some data may be out of date. {dataError}<button onClick={() => void refreshPatientData()}>Retry</button></div>}

    <section className="patient-summary-grid" aria-label="Health summary">
      <article className="patient-summary-card is-indigo"><div className="patient-card-icon"><Activity /></div><div><span>Today’s adherence</span><strong>{medicines.length ? `${adherenceRate}%` : "—"}</strong></div><small>{medicines.length ? (adherenceRate >= 80 ? "On track" : "Needs attention") : "No medications yet"}</small></article>
      <article className="patient-summary-card is-violet"><div className="patient-card-icon"><BrainCircuit /></div><div><span>Risk signal</span><strong>{medicines.length ? `${riskPercent}%` : "—"}</strong></div><small>{medicines.length ? `${riskAssessment.overall.band} adherence risk` : "Awaiting medication data"}</small></article>
      <article className="patient-summary-card is-cyan"><div className="patient-card-icon"><CalendarDays /></div><div><span>Upcoming visits</span><strong>{upcomingAppointments.length}</strong></div><small>{nextAppointment ? `${nextAppointment.date} · ${nextAppointment.time}` : "No visits scheduled"}</small></article>
      <article className="patient-summary-card is-amber"><div className="patient-card-icon"><AlertCircle /></div><div><span>Needs attention</span><strong>{pending + missed + lowStock}</strong></div><small>{missed} missed · {pending} due · {lowStock} low stock</small></article>
    </section>

    <div className="patient-content-grid">
      <main className="patient-primary-column">
        <section className="patient-panel patient-medications">
          <div className="patient-panel-header"><div><span className="patient-section-label">Medication schedule</span><h2>Today’s medications</h2><p>Log a dose when you take it to keep your care team current.</p></div><Link to="/patient/add-data">Manage <ChevronRight className="h-4 w-4" /></Link></div>
          <div className="patient-med-list">
            {medicines.map((medicine) => { const dose = medicine.doses[0]; const canLog = dose && dose.status !== "taken"; return <article key={medicine.id} className="patient-med-row">
              <div className="patient-med-icon"><Pill className="h-5 w-5" /></div><div className="patient-med-info"><div><h3>{medicine.name}</h3><span>{medicine.dosage}</span></div><p>{dose?.time || medicine.frequency} · {medicine.frequency}</p></div>
              <span className={`patient-status is-${dose?.status || "scheduled"}`}>{doseLabel(dose?.status || "scheduled", dose?.takenAt)}</span><div className="patient-stock"><span>Stock</span><strong>{medicine.stock}</strong></div>
              <button disabled={!canLog} onClick={() => dose && logDose(medicine.id, dose.id)} className="patient-dose-button">{canLog ? <><CheckCircle2 className="h-4 w-4" /> Mark taken</> : <><Check className="h-4 w-4" /> Logged</>}</button>
            </article>; })}
            {!medicines.length && <div className="patient-empty"><Pill className="h-6 w-6" /><h3>No medications added</h3><p>Add your medications to see today’s schedule and adherence.</p><Link to="/patient/add-data">Add medication</Link></div>}
          </div>
        </section>

        <div className="patient-lower-grid">
          <section className="patient-panel compact"><div className="patient-panel-header"><div><span className="patient-section-label">Schedule</span><h2>Next appointment</h2></div><Link to="/patient/appointments">View all</Link></div>{nextAppointment ? <div className="patient-detail-row"><div className="patient-detail-icon"><CalendarDays /></div><div><strong>{nextAppointment.reason}</strong><p>{nextAppointment.withName}</p><span>{nextAppointment.date} · {nextAppointment.time}</span></div></div> : <div className="patient-empty small"><CalendarDays /><p>No upcoming appointments.</p><Link to="/patient/add-data">Book a visit</Link></div>}</section>
          <section className="patient-panel compact"><div className="patient-panel-header"><div><span className="patient-section-label">Latest reading</span><h2>Vitals snapshot</h2></div><Link to="/patient/vitals">History</Link></div>{latestVital ? <div className="patient-vitals-grid"><div><HeartPulse /><strong>{latestVital.heartRate || "—"}</strong><span>bpm</span></div><div><Activity /><strong>{latestVital.bpSys || "—"}/{latestVital.bpDia || "—"}</strong><span>mmHg</span></div><div><span className="patient-glucose">G</span><strong>{latestVital.glucose || "—"}</strong><span>glucose</span></div></div> : <div className="patient-empty small"><HeartPulse /><p>No vital readings yet.</p><Link to="/patient/add-data">Log vitals</Link></div>}</section>
        </div>
      </main>

      <aside className="patient-secondary-column">
        <section className="patient-panel patient-risk-panel"><div className="patient-panel-header"><div><span className="patient-section-label">Decision support</span><h2>AI adherence insight</h2></div>{medicines.length > 0 && <RiskBadge risk={riskAssessment.overall} />}</div>
          {medicines.length ? <><div className="patient-risk-main"><AdherenceRing percent={riskPercent} size={94} label="risk score" mode="risk" /><div><strong>{riskAssessment.overall.band === "high" ? "High risk" : riskAssessment.overall.band === "medium" ? "Moderate risk" : "Low risk"}</strong><p>The model estimates future missed-dose likelihood from your current medication behavior.</p></div></div><dl className="patient-risk-factors"><div><dt>Missed doses</dt><dd>{missed}</dd></div><div><dt>Pending doses</dt><dd>{pending}</dd></div><div><dt>Low stock</dt><dd>{lowStock}</dd></div><div><dt>Highest-risk medication</dt><dd>{topRisk?.medicine.name || "—"}</dd></div></dl></> : <div className="patient-empty small"><BrainCircuit /><p>Add medication data to generate an adherence risk insight.</p></div>}
          <div className="patient-disclaimer"><ShieldCheck className="h-4 w-4" /><p>Decision-support prototype only. It does not diagnose conditions or replace medical advice.</p></div>
        </section>
        <section className="patient-panel compact"><div className="patient-panel-header"><div><span className="patient-section-label">Connected care</span><h2>Care network</h2></div><Link to="/patient/care-network">Manage</Link></div><div className="patient-care-list"><div><span><UserRound /></span><p><small>Caregiver</small><strong>{patient.primaryCaregiver}</strong></p></div><div><span><Stethoscope /></span><p><small>Physician</small><strong>{patient.physician}</strong></p></div></div>{!connectedCareMembers.length && <p className="patient-muted-note">No care-team connections are active yet.</p>}</section>
      </aside>
    </div>
  </div>;
}
