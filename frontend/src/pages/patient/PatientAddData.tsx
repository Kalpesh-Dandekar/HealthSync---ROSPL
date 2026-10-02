import { FormEvent, useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Package, Pill, Plus, RefreshCw, Trash2 } from "lucide-react";
import { patientDataApi, type MedicationRecord } from "../../api/patientData";
import { useAppData } from "../../data/AppDataContext";
import { EmptyState, Field, Notice, PageHeader, PatientPage, SectionCard } from "../../components/patient/PatientUI";

type Feedback = { tone: "success" | "error"; text: string } | null;

export function PatientAddData() {
  const { refreshPatientData } = useAppData();
  const [medications, setMedications] = useState<MedicationRecord[]>([]);
  const [form, setForm] = useState({ name: "", dosage: "", schedule: "", stock: "0" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await patientDataApi.getMedications();
      setMedications(data.medications);
      setFeedback(null);
    } catch (error) {
      setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to load medications." });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function addMedication(event: FormEvent) {
    event.preventDefault();
    setBusy("add"); setFeedback(null);
    try {
      await patientDataApi.addMedication({ ...form, stock: Number(form.stock) });
      setForm({ name: "", dosage: "", schedule: "", stock: "0" });
      await Promise.all([load(), refreshPatientData()]);
      setFeedback({ tone: "success", text: "Medication saved. It is now available in your Overview schedule." });
    } catch (error) {
      setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to save medication." });
    } finally { setBusy(""); }
  }

  async function markTaken(id: number) {
    setBusy(`take-${id}`); setFeedback(null);
    try {
      await patientDataApi.takeMedication(id);
      await Promise.all([load(), refreshPatientData()]);
      setFeedback({ tone: "success", text: "Dose recorded as taken and stock updated." });
    } catch (error) { setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to record dose." }); }
    finally { setBusy(""); }
  }

  async function removeMedication(id: number) {
    setBusy(`delete-${id}`); setFeedback(null);
    try {
      await patientDataApi.deleteMedication(id);
      setConfirmDelete(null);
      await Promise.all([load(), refreshPatientData()]);
      setFeedback({ tone: "success", text: "Medication removed from your record." });
    } catch (error) { setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to remove medication." }); }
    finally { setBusy(""); }
  }

  return <PatientPage>
    <PageHeader eyebrow="My health" title="Medications" description="Add medicines, review schedules and record doses using your persisted HealthSync medication record." action={<button className="patient-secondary-button" onClick={() => void load()} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>} />
    {feedback && <Notice tone={feedback.tone}>{feedback.tone === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}{feedback.text}</Notice>}
    <div className="grid gap-4 xl:grid-cols-[minmax(300px,.7fr)_minmax(0,1.3fr)]">
      <SectionCard title="Add medication" description="Name, dosage, schedule and stock are stored in your account.">
        <form className="space-y-3" onSubmit={addMedication}>
          <Field label="Medication name"><input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="e.g. Metformin" required /></Field>
          <Field label="Dosage"><input value={form.dosage} onChange={event => setForm({ ...form, dosage: event.target.value })} placeholder="e.g. 500 mg" required /></Field>
          <Field label="Schedule or time"><input value={form.schedule} onChange={event => setForm({ ...form, schedule: event.target.value })} placeholder="e.g. 08:00 AM with breakfast" required /></Field>
          <Field label="Available stock" hint="Whole number of doses currently available."><input type="number" min="0" step="1" value={form.stock} onChange={event => setForm({ ...form, stock: event.target.value })} required /></Field>
          <button className="patient-primary-button w-full" disabled={busy === "add"}><Plus className="h-4 w-4" />{busy === "add" ? "Saving…" : "Save medication"}</button>
        </form>
      </SectionCard>

      <SectionCard title="Current medications" description={`${medications.length} medication${medications.length === 1 ? "" : "s"} in your account`}>
        {loading ? <div className="patient-ui-empty"><RefreshCw className="h-6 w-6 animate-spin" /><p>Loading medications…</p></div> : medications.length ? <div className="space-y-2">
          {medications.map(item => { const latest = item.logs?.[0]; const taken = latest?.status === "TAKEN"; return <article key={item.id} className="rounded-xl border border-[rgba(142,153,194,.14)] bg-[rgba(18,24,52,.58)] p-3">
            <div className="flex flex-wrap items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300"><Pill className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-2"><h3 className="font-semibold">{item.name}</h3><span className="text-xs text-slate-400">{item.dosage}</span></div><p className="mt-0.5 text-xs text-slate-400">{item.schedule}</p></div><div className="text-right"><span className="text-[10px] uppercase tracking-wider text-slate-500">Stock</span><p className="font-semibold"><Package className="mr-1 inline h-3.5 w-3.5 text-cyan-300" />{item.stock}</p></div></div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(142,153,194,.12)] pt-3"><span className={`patient-status-pill ${taken ? "is-success" : "is-info"}`}>{taken ? "Latest dose taken" : latest?.status?.toLowerCase() || "No dose logged"}</span><div className="flex gap-2">{confirmDelete === item.id ? <><button className="patient-danger-button" onClick={() => void removeMedication(item.id)} disabled={busy === `delete-${item.id}`}><Trash2 className="h-3.5 w-3.5" /> Confirm remove</button><button className="patient-secondary-button" onClick={() => setConfirmDelete(null)}>Keep</button></> : <><button className="patient-secondary-button" onClick={() => void markTaken(item.id)} disabled={busy === `take-${item.id}`}><CheckCircle2 className="h-3.5 w-3.5" />{busy === `take-${item.id}` ? "Recording…" : "Mark taken"}</button><button aria-label={`Remove ${item.name}`} className="patient-danger-button px-3" onClick={() => setConfirmDelete(item.id)}><Trash2 className="h-3.5 w-3.5" /></button></>}</div></div>
          </article>; })}
        </div> : <EmptyState icon={Pill} title="No medications yet" description="Add your first medication using the form. It will appear here and on your Overview." />}
      </SectionCard>
    </div>
  </PatientPage>;
}
