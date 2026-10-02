import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Check, HeartPulse, Plus, RefreshCw } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { patientDataApi, type VitalRecord } from "../../api/patientData";
import { useAppData } from "../../data/AppDataContext";
import { EmptyState, Field, Notice, PageHeader, PatientPage, SectionCard } from "../../components/patient/PatientUI";

export function PatientVitals() {
  const { refreshPatientData } = useAppData();
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [form, setForm] = useState({ heartRate: "", systolic: "", diastolic: "", glucose: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => { setLoading(true); try { const data = await patientDataApi.getVitals(); setVitals(data.vitals); setFeedback(null); } catch (error) { setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to load vital readings." }); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setFeedback(null);
    try { await patientDataApi.addVital(form); setForm({ heartRate: "", systolic: "", diastolic: "", glucose: "" }); await Promise.all([load(), refreshPatientData()]); setFeedback({ tone: "success", text: "Vital reading saved to your health record." }); }
    catch (error) { setFeedback({ tone: "error", text: error instanceof Error ? error.message : "Unable to save vital reading." }); }
    finally { setSaving(false); }
  }

  const latest = vitals[0];
  const chartData = useMemo(() => [...vitals].reverse().map(vital => ({ ...vital, label: new Date(vital.recordedAt).toLocaleDateString([], { month: "short", day: "numeric" }) })), [vitals]);
  const metrics = [{ label: "Heart rate", value: latest?.heartRate, unit: "bpm", icon: HeartPulse }, { label: "Blood pressure", value: latest?.systolic && latest?.diastolic ? `${latest.systolic}/${latest.diastolic}` : null, unit: "mmHg", icon: Activity }, { label: "Glucose", value: latest?.glucose, unit: "mg/dL", icon: Activity }];

  return <PatientPage>
    <PageHeader eyebrow="Health metrics" title="Vitals" description="Record supported health measurements and review only the readings stored in your HealthSync account." action={<button className="patient-secondary-button" onClick={() => void load()} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>} />
    {feedback && <Notice tone={feedback.tone}>{feedback.tone === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}{feedback.text}</Notice>}
    <div className="grid gap-3 sm:grid-cols-3">{metrics.map(({ label, value, unit, icon: Icon }) => <article key={label} className="patient-section-card flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300"><Icon className="h-5 w-5" /></span><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-xl font-semibold">{value ?? "—"} <small className="text-xs font-normal text-slate-400">{unit}</small></p></div></article>)}</div>
    <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <SectionCard title="Record vitals" description="Enter at least one reading. Blank metrics remain unset."><form className="space-y-3" onSubmit={submit}><Field label="Heart rate (bpm)"><input type="number" min="1" value={form.heartRate} onChange={e => setForm({ ...form, heartRate: e.target.value })} placeholder="e.g. 72" /></Field><div className="patient-form-grid"><Field label="Systolic"><input type="number" min="1" value={form.systolic} onChange={e => setForm({ ...form, systolic: e.target.value })} placeholder="120" /></Field><Field label="Diastolic"><input type="number" min="1" value={form.diastolic} onChange={e => setForm({ ...form, diastolic: e.target.value })} placeholder="80" /></Field></div><Field label="Glucose (mg/dL)"><input type="number" min="1" step="0.1" value={form.glucose} onChange={e => setForm({ ...form, glucose: e.target.value })} placeholder="e.g. 95" /></Field><button className="patient-primary-button w-full" disabled={saving}><Plus className="h-4 w-4" />{saving ? "Saving…" : "Save reading"}</button></form></SectionCard>
      <SectionCard title="Recorded trends" description={latest ? `Latest entry ${new Date(latest.recordedAt).toLocaleString()}` : "Charts appear when readings are available."}>{loading ? <div className="patient-ui-empty"><RefreshCw className="h-6 w-6 animate-spin" /><p>Loading vital history…</p></div> : chartData.length ? <div className="h-[260px] min-w-0"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ left: -20, right: 10 }}><CartesianGrid stroke="rgba(148,163,184,.12)" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#77819d" fontSize={10} tickLine={false} /><YAxis stroke="#77819d" fontSize={10} tickLine={false} /><Tooltip contentStyle={{ background: "#0d1126", border: "1px solid rgba(142,153,194,.2)", borderRadius: 10, color: "#fff", fontSize: 12 }} /><Line connectNulls type="monotone" dataKey="heartRate" name="Heart rate" stroke="#22d3ee" strokeWidth={2} dot={{ r: 2 }} /><Line connectNulls type="monotone" dataKey="glucose" name="Glucose" stroke="#a78bfa" strokeWidth={2} dot={{ r: 2 }} /></LineChart></ResponsiveContainer></div> : <EmptyState icon={HeartPulse} title="No vital readings" description="Use the form to add your first recorded measurement." />}</SectionCard>
    </div>
    <SectionCard title="Reading history" description="Newest entries appear first.">{vitals.length ? <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{vitals.map(vital => <article key={vital.id} className="rounded-xl border border-[rgba(142,153,194,.14)] bg-[rgba(18,24,52,.55)] p-3"><time className="text-[10px] text-slate-400">{new Date(vital.recordedAt).toLocaleString()}</time><div className="mt-2 grid grid-cols-3 gap-2 text-xs"><span>HR <b>{vital.heartRate ?? "—"}</b></span><span>BP <b>{vital.systolic ?? "—"}/{vital.diastolic ?? "—"}</b></span><span>Glucose <b>{vital.glucose ?? "—"}</b></span></div></article>)}</div> : !loading && <EmptyState icon={Activity} title="History is empty" description="Saved readings will appear here." />}</SectionCard>
  </PatientPage>;
}
