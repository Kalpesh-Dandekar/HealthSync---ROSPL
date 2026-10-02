import { Activity, CalendarDays, Download, FileHeart, Pill, UserRound } from "lucide-react";
import { useAppData } from "../../data/AppDataContext";
import { EmptyState, PageHeader, PatientPage, SectionCard } from "../../components/patient/PatientUI";

export function PatientRecords() {
  const { patient, medicines, vitals, appointments } = useAppData();
  const latest = vitals[0];

  function exportRecord() {
    const lines = [
      "HealthSync Patient Health Record", `Patient: ${patient.name || "Not available"}`, `Patient ID: ${patient.patientCode || "Not available"}`,
      `Caregiver: ${patient.primaryCaregiver}`, `Physician: ${patient.physician}`, "", "MEDICATIONS",
      ...(medicines.length ? medicines.map(item => `${item.name} | ${item.dosage} | ${item.frequency} | Stock ${item.stock}`) : ["No medications recorded."]), "", "VITAL READINGS",
      ...(vitals.length ? vitals.map(item => `${item.time} | HR ${item.heartRate || "—"} | BP ${item.bpSys || "—"}/${item.bpDia || "—"} | Glucose ${item.glucose || "—"}`) : ["No vitals recorded."]), "", "APPOINTMENTS",
      ...(appointments.length ? appointments.map(item => `${item.date} ${item.time} | ${item.reason} | ${item.withName} | ${item.status}`) : ["No appointments recorded."]), "", "Generated from the patient’s currently authorized HealthSync data."
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "healthsync-patient-record.txt"; link.click(); URL.revokeObjectURL(url);
  }

  return <PatientPage>
    <PageHeader eyebrow="Health history" title="Records" description="A consolidated view of the medications, readings and appointments currently stored for your account." action={<button className="patient-secondary-button" onClick={exportRecord}><Download className="h-4 w-4" /> Export text record</button>} />
    <div className="grid gap-4 lg:grid-cols-[.7fr_1.3fr]">
      <div className="space-y-4"><SectionCard title="Patient information"><dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><div><dt className="text-[10px] uppercase tracking-wider text-slate-500">Name</dt><dd className="mt-1 font-semibold">{patient.name || "—"}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-slate-500">Patient ID</dt><dd className="mt-1 font-semibold">{patient.patientCode || "—"}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-slate-500">Caregiver</dt><dd className="mt-1 text-sm">{patient.primaryCaregiver}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-slate-500">Physician</dt><dd className="mt-1 text-sm">{patient.physician}</dd></div></dl></SectionCard><SectionCard title="Latest recorded vitals">{latest ? <div className="grid grid-cols-3 gap-2">{[["Heart rate", latest.heartRate, "bpm"], ["Blood pressure", `${latest.bpSys || "—"}/${latest.bpDia || "—"}`, "mmHg"], ["Glucose", latest.glucose, "mg/dL"]].map(([label, value, unit]) => <div key={String(label)} className="rounded-xl bg-cyan-500/5 p-3"><span className="text-[9px] text-slate-400">{label}</span><strong className="mt-1 block text-sm">{value || "—"}</strong><small className="text-[9px] text-slate-500">{unit}</small></div>)}</div> : <EmptyState icon={Activity} title="No vital readings" description="Recorded readings will appear here." />}</SectionCard></div>
      <div className="space-y-4"><SectionCard title="Medication record" description={`${medicines.length} stored medication${medicines.length === 1 ? "" : "s"}`}>{medicines.length ? <div className="space-y-2">{medicines.map(item => <article key={item.id} className="flex items-center gap-3 rounded-xl border border-[rgba(142,153,194,.13)] bg-[rgba(18,24,52,.55)] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300"><Pill className="h-4 w-4" /></span><div className="flex-1"><h3 className="text-sm font-semibold">{item.name} <span className="font-normal text-slate-400">{item.dosage}</span></h3><p className="text-xs text-slate-400">{item.frequency} · Stock {item.stock}</p></div></article>)}</div> : <EmptyState icon={Pill} title="No medications" description="Your medication record is currently empty." />}</SectionCard><SectionCard title="Appointment record" description={`${appointments.length} stored appointment${appointments.length === 1 ? "" : "s"}`}>{appointments.length ? <div className="space-y-2">{appointments.map(item => <article key={item.id} className="flex items-center gap-3 rounded-xl border border-[rgba(142,153,194,.13)] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300"><CalendarDays className="h-4 w-4" /></span><div className="flex-1"><h3 className="text-sm font-semibold">{item.reason}</h3><p className="text-xs text-slate-400">{item.withName} · {item.date} at {item.time}</p></div><span className="patient-status-pill">{item.status}</span></article>)}</div> : <EmptyState icon={CalendarDays} title="No appointments" description="Your appointment record is currently empty." />}</SectionCard></div>
    </div>
    <div className="patient-notice"><FileHeart className="h-4 w-4" />This view summarizes HealthSync data and is not a substitute for an official medical record from your healthcare provider.<UserRound className="ml-auto hidden h-4 w-4 sm:block" /></div>
  </PatientPage>;
}
