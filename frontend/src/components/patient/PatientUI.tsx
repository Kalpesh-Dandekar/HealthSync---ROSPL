import type { ComponentType, ReactNode } from "react";
import { Inbox } from "lucide-react";
import "./patient-ui.css";

export function PatientPage({ children }: { children: ReactNode }) {
  return <div className="patient-page">{children}</div>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <header className="patient-page-header"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action && <div className="patient-page-action">{action}</div>}</header>;
}

export function SectionCard({ title, description, action, children, className = "" }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`patient-section-card ${className}`}>{(title || action) && <div className="patient-section-head"><div>{title && <h2>{title}</h2>}{description && <p>{description}</p>}</div>{action}</div>}{children}</section>;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: { icon?: ComponentType<{ className?: string }>; title: string; description: string; action?: ReactNode }) {
  return <div className="patient-ui-empty"><Icon className="h-6 w-6" /><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "warning" | "error"; children: ReactNode }) {
  return <div className={`patient-notice is-${tone}`} role={tone === "error" ? "alert" : "status"}>{children}</div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="patient-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
