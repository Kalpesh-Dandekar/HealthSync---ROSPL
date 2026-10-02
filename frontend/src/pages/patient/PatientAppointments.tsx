import { FormEvent, useCallback, useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, Check, Clock, Plus, RefreshCw, Stethoscope, X } from "lucide-react";
import { patientDataApi, type AppointmentRecord } from "../../api/patientData";
import { useAppData } from "../../data/AppDataContext";
import { EmptyState, Field, Notice, PageHeader, PatientPage, SectionCard } from "../../components/patient/PatientUI";

export function PatientAppointments() {
  const { refreshPatientData } = useAppData();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [form, setForm] = useState({ title: "", doctor: "", date: "", time: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => { setLoading(true); try { const data = await patientDataApi.getAppointments(); setAppointments(data.appointments); setFeedback(null); } catch (error) { setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to load appointments." }); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);

  async function submit(event: FormEvent) { event.preventDefault(); setBusy("create"); setFeedback(null); try { await patientDataApi.addAppointment(form); setForm({ title: "", doctor: "", date: "", time: "" }); setShowForm(false); await Promise.all([load(), refreshPatientData()]); setFeedback({ tone: "success", text: "Appointment saved to your account." }); } catch (error) { setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to save appointment." }); } finally { setBusy(""); } }
  async function cancel(id: number) { setBusy(`cancel-${id}`); setFeedback(null); try { await patientDataApi.cancelAppointment(id); await Promise.all([load(), refreshPatientData()]); setFeedback({ tone: "success", text: "Appointment cancelled." }); } catch (error) { setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to cancel appointment." }); } finally { setBusy(""); } }

  const upcoming = appointments.filter(item => !["cancelled", "completed"].includes(item.status.toLowerCase()));
  const history = appointments.filter(item => ["cancelled", "completed"].includes(item.status.toLowerCase()));
  const statusClass = (status: string) => status.toLowerCase() === "cancelled" ? "is-error" : status.toLowerCase() === "completed" ? "is-success" : "is-info";

  return <PatientPage>
    <PageHeader eyebrow="Care schedule" title="Appointments" description="Book and manage visits stored in your HealthSync account. Appointment status is updated by your connected care team." action={<button className="patient-primary-button" onClick={() => setShowForm(value => !value)}><Plus className="h-4 w-4" />{showForm ? "Close form" : "Book appointment"}</button>} />
    {feedback && <Notice tone={feedback.tone}>{feedback.tone === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}{feedback.text}</Notice>}
    {showForm && <SectionCard title="Book an appointment" description="This flow stores the doctor, reason, date and time supported by the current backend."><form onSubmit={submit}><div className="patient-form-grid"><Field label="Reason or title"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Medication follow-up" /></Field><Field label="Doctor"><input required value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} placeholder="e.g. Dr. Rao" /></Field><Field label="Date"><input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field><Field label="Time"><input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></Field></div><div className="mt-4 flex justify-end gap-2"><button type="button" className="patient-secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="patient-primary-button" disabled={busy === "create"}>{busy === "create" ? "Saving…" : "Save appointment"}</button></div></form></SectionCard>}
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
      <SectionCard title="Upcoming appointments" description={`${upcoming.length} active appointment${upcoming.length === 1 ? "" : "s"}`} action={<button className="patient-secondary-button" onClick={() => void load()} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>}>
        {loading ? <div className="patient-ui-empty"><RefreshCw className="h-6 w-6 animate-spin" /><p>Loading appointments…</p></div> : upcoming.length ? <div className="space-y-2">{upcoming.map(item => <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-[rgba(142,153,194,.14)] bg-[rgba(18,24,52,.58)] p-4 sm:flex-row sm:items-center"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300"><CalendarDays className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.title}</h3><span className={`patient-status-pill ${statusClass(item.status)}`}>{item.status}</span></div><p className="mt-1 text-xs text-slate-400"><Stethoscope className="mr-1 inline h-3.5 w-3.5" />{item.doctor}</p><p className="mt-1 text-xs text-slate-400"><Clock className="mr-1 inline h-3.5 w-3.5" />{item.date} · {item.time}</p></div><button className="patient-danger-button" onClick={() => void cancel(item.id)} disabled={busy === `cancel-${item.id}`}><X className="h-4 w-4" />{busy === `cancel-${item.id}` ? "Cancelling…" : "Cancel"}</button></article>)}</div> : <EmptyState icon={CalendarDays} title="No upcoming appointments" description="Book a visit when you need to coordinate upcoming care." action={<button className="patient-primary-button" onClick={() => setShowForm(true)}>Book appointment</button>} />}
      </SectionCard>
      <SectionCard title="History" description="Completed and cancelled appointments.">{history.length ? <div className="space-y-2">{history.map(item => <article key={item.id} className="rounded-xl border border-[rgba(142,153,194,.12)] p-3"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{item.title}</h3><span className={`patient-status-pill ${statusClass(item.status)}`}>{item.status}</span></div><p className="mt-1 text-xs text-slate-400">{item.doctor} · {item.date}</p></article>)}</div> : <EmptyState icon={Clock} title="No appointment history" description="Completed or cancelled visits will appear here." />}</SectionCard>
    </div>
  </PatientPage>;
}
