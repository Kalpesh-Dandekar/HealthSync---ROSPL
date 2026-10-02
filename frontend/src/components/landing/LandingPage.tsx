import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, AlarmClock, ArrowRight, CalendarDays, Check, ChevronRight,
  ClipboardCheck, FileHeart, HeartPulse, Menu, Pill, ShieldCheck, Siren,
  Sparkles, Stethoscope, Users, UserRound, X,
} from "lucide-react";
import "./landing.css";

const features = [
  [Pill, "Medication management", "Clear schedules, reminders and adherence history."],
  [CalendarDays, "Appointments", "Keep every consultation organized and visible."],
  [ClipboardCheck, "Digital prescriptions", "Access treatment instructions in one trusted place."],
  [FileHeart, "Medical records", "Bring important health information together."],
  [Users, "Caregiver monitoring", "Share the signals that matter with your care circle."],
  [Siren, "Emergency assistance", "Surface urgent events quickly to the right people."],
] as const;

const roles = [
  [UserRound, "Patient", "Daily health, made manageable.", "cyan"],
  [Stethoscope, "Doctor", "Clinical context at a glance.", "blue"],
  [Users, "Caregiver", "Support without the guesswork.", "violet"],
  [ShieldCheck, "Admin", "Confident platform oversight.", "amber"],
] as const;

function Brand() {
  return <Link className="landing-brand" to="/" aria-label="HealthSync home"><span className="landing-brand-mark"><HeartPulse aria-hidden="true" /></span><span>Health<span>Sync</span></span></Link>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="landing-nav-wrap"><nav className="landing-nav" aria-label="Main navigation">
    <Brand />
    <button className="landing-menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="landing-menu" aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X /> : <Menu />}</button>
    <div id="landing-menu" className={`landing-nav-panel ${open ? "is-open" : ""}`}>
      <div className="landing-nav-links"><a href="#features" onClick={close}>Features</a><a href="#how-it-works" onClick={close}>How it works</a><a href="#connected-care" onClick={close}>Connected care</a></div>
      <div className="landing-nav-actions"><Link className="landing-login" to="/login" onClick={close}>Log in</Link><Link className="landing-button landing-button-small" to="/signup" onClick={close}>Get started <ArrowRight /></Link></div>
    </div>
  </nav></header>;
}

function ConnectedCareVisual() {
  return <div className="care-visual" aria-label="HealthSync connects patients, doctors and caregivers">
    <div className="care-orbit care-orbit-one" aria-hidden="true" /><div className="care-orbit care-orbit-two" aria-hidden="true" />
    <svg className="care-lines" viewBox="0 0 560 500" aria-hidden="true"><path d="M280 110 L145 352" /><path d="M280 110 L415 352" /><path d="M145 352 L415 352" /></svg>
    <div className="care-node care-node-patient"><UserRound /><span>Patient</span></div>
    <div className="care-core"><HeartPulse /><strong>HealthSync</strong><span>Care intelligence</span></div>
    <div className="care-node care-node-doctor"><Stethoscope /><span>Doctor</span></div><div className="care-node care-node-caregiver"><Users /><span>Caregiver</span></div>
    <div className="care-signal care-signal-med"><Pill /> Medication</div><div className="care-signal care-signal-vitals"><Activity /> Vitals</div>
    <div className="care-signal care-signal-appt"><CalendarDays /> Appointments</div><div className="care-signal care-signal-records"><FileHeart /> Records</div>
  </div>;
}

function Hero() {
  return <section className="landing-hero" aria-labelledby="landing-title">
    <div className="landing-hero-copy landing-reveal"><div className="landing-eyebrow"><Sparkles /> Connected care, thoughtfully designed</div><h1 id="landing-title">Healthcare,<br /><span>finally in sync.</span></h1><p>Medication, appointments, health records and coordinated care—connected for patients, doctors and caregivers in one clear experience.</p><div className="landing-hero-actions"><Link className="landing-button" to="/signup">Get started <ArrowRight /></Link><a className="landing-button landing-button-secondary" href="#features">Explore features <ChevronRight /></a></div><div className="landing-trust-row"><span><ShieldCheck /> Role-aware access</span><span><Activity /> Connected health signals</span></div></div>
    <div className="landing-reveal landing-reveal-delay"><ConnectedCareVisual /></div>
  </section>;
}

function Features() {
  return <section className="landing-section" id="features" aria-labelledby="features-title"><div className="landing-section-heading"><div><span className="landing-kicker">One connected workspace</span><h2 id="features-title">The essentials of care,<br />working together.</h2></div><p>Less fragmentation. More clarity for every person involved in the care journey.</p></div><div className="feature-grid">{features.map(([Icon, title, text], index) => <article className={`feature-card ${index === 5 ? "feature-emergency" : ""}`} key={title}><span className="feature-icon"><Icon /></span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight className="feature-arrow" aria-hidden="true" /></article>)}</div></section>;
}

function MedicationShowcase() {
  const steps = [[AlarmClock, "Reminder"], [Check, "Patient response"], [Activity, "Adherence updated"], [Users, "Caregiver visibility"]] as const;
  return <section className="landing-section medication-section" id="how-it-works" aria-labelledby="medication-title"><div className="medication-copy"><span className="landing-kicker">Built for better adherence</span><h2 id="medication-title">A simple reminder.<br />A clearer care signal.</h2><p>HealthSync turns a daily medication moment into useful, shared context—without adding complexity to the patient’s day.</p><div className="medication-flow" aria-label="Medication adherence workflow">{steps.map(([Icon, label], index) => <div className="flow-step" key={label}><span><Icon /></span><strong>{label}</strong>{index < 3 && <ArrowRight aria-hidden="true" />}</div>)}</div></div>
    <div className="medication-demo" aria-label="Example medication reminder"><div className="demo-topline"><span><Pill /> Medication reminder</span><span className="demo-live"><i /> Now</span></div><div className="demo-time"><strong>8:00</strong><span>AM</span></div><div className="demo-medication"><div><span>M</span><div><strong>Metformin</strong><small>1 tablet · After breakfast</small></div></div><span className="demo-dose">500 mg</span></div><div className="demo-actions"><button type="button" className="demo-taken"><Check /> Taken</button><button type="button">Snooze</button><button type="button">Skip</button></div><div className="demo-status"><Activity /><span><strong>Adherence updated</strong>Your care circle stays informed.</span></div></div>
  </section>;
}

function Roles() {
  return <section className="landing-section roles-section" id="connected-care" aria-labelledby="roles-title"><div className="roles-intro"><span className="landing-kicker">Connected care</span><h2 id="roles-title">One platform.<br />Every perspective.</h2><p>Each role gets the context they need, while contributing to one continuous picture of care.</p></div><div className="roles-list">{roles.map(([Icon, title, text, tone], index) => <article className={`role-item role-${tone}`} key={title}><span className="role-number">0{index + 1}</span><span className="role-icon"><Icon /></span><div><h3>{title}</h3><p>{text}</p></div><ChevronRight /></article>)}</div></section>;
}

function Footer() {
  return <><section className="landing-cta" aria-labelledby="cta-title"><div><span className="landing-kicker">Care moves better together</span><h2 id="cta-title">Better care starts<br />when everything connects.</h2></div><div className="landing-cta-actions"><Link className="landing-button" to="/signup">Get started <ArrowRight /></Link><Link className="landing-login" to="/login">Log in</Link></div></section><footer className="landing-footer"><Brand /><p>Connected health, made human.</p><span>© {new Date().getFullYear()} HealthSync</span></footer></>;
}

export function LandingPage() {
  return <div className="healthsync-landing"><a className="skip-link" href="#main-content">Skip to content</a><Navbar /><main id="main-content"><Hero /><Features /><MedicationShowcase /><Roles /><Footer /></main></div>;
}
