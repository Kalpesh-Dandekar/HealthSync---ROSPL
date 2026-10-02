import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlarmClock,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileHeart,
  HeartPulse,
  Menu,
  Pill,
  ShieldCheck,
  Siren,
  Stethoscope,
  Users,
  UserRound,
  X,
} from "lucide-react";
import "./landing.css";

const features = [
  { icon: Pill, title: "Medication management", text: "Schedules, reminders and adherence history in one clear routine.", detail: "Next dose · 8:00 AM" },
  { icon: CalendarDays, title: "Appointments", text: "Organize consultations and keep upcoming care visible.", detail: "Calendar synced" },
  { icon: ClipboardCheck, title: "Digital prescriptions", text: "Treatment instructions that stay accessible and organized.", detail: "Secure access" },
  { icon: FileHeart, title: "Medical records", text: "Important health information brought into one patient timeline.", detail: "Unified history" },
  { icon: Users, title: "Caregiver monitoring", text: "The right adherence signals for timely, informed support.", detail: "Care circle connected" },
  { icon: Siren, title: "Emergency assistance", text: "Urgent events surfaced quickly to the people who can help.", detail: "Priority alerts", emergency: true },
] as const;

const roles = [
  { icon: UserRound, title: "Patient", summary: "Stay on top of daily care.", items: ["Medication schedules", "Appointments", "Health records"], tone: "cyan" },
  { icon: Stethoscope, title: "Doctor", summary: "See the context behind every visit.", items: ["Patient context", "Digital prescriptions", "Appointments"], tone: "blue" },
  { icon: Users, title: "Caregiver", summary: "Support linked patients with clarity.", items: ["Adherence visibility", "Patient support", "Priority alerts"], tone: "violet" },
  { icon: ShieldCheck, title: "Admin", summary: "Keep the care platform organized.", items: ["User oversight", "Doctor access", "Platform visibility"], tone: "amber" },
] as const;

function Brand() {
  return (
    <Link className="landing-brand" to="/" aria-label="HealthSync home">
      <span className="landing-brand-mark"><HeartPulse aria-hidden="true" /></span>
      <span>Health<span>Sync</span></span>
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="landing-nav-wrap">
      <nav className="landing-nav" aria-label="Main navigation">
        <Brand />
        <button className="landing-menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="landing-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
          {open ? <X /> : <Menu />}
        </button>
        <div id="landing-menu" className={`landing-nav-panel ${open ? "is-open" : ""}`}>
          <div className="landing-nav-links">
            <a href="#features" onClick={close}>Features</a>
            <a href="#how-it-works" onClick={close}>How it works</a>
            <a href="#connected-care" onClick={close}>Connected care</a>
          </div>
          <div className="landing-nav-actions">
            <Link className="landing-login" to="/login" onClick={close}>Log in</Link>
            <Link className="landing-button landing-button-small" to="/signup" onClick={close}>Get started <ArrowRight /></Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

function CareOverview() {
  return (
    <div className="care-preview landing-reveal landing-reveal-delay" aria-label="HealthSync care overview product preview">
      <div className="preview-window-bar"><span /><span /><span /><small>Care overview</small></div>
      <div className="preview-content">
        <div className="preview-heading">
          <div><span>Good morning</span><strong>Today&apos;s care</strong></div>
          <button type="button" aria-label="View notifications"><AlarmClock /></button>
        </div>
        <div className="preview-primary-card">
          <div className="preview-label"><span className="preview-icon preview-icon-indigo"><Pill /></span><span>Medication</span><small>8:00 AM</small></div>
          <div className="preview-med-row"><div><strong>Metformin</strong><span>1 tablet · 500 mg</span></div><span className="status-complete"><Check /> Taken</span></div>
        </div>
        <div className="preview-grid">
          <div className="preview-module preview-appointment">
            <div className="preview-label"><span className="preview-icon preview-icon-blue"><CalendarDays /></span><span>Next appointment</span></div>
            <strong>Dr. Mehta</strong><span>Today · 10:30 AM</span><small>Upcoming</small>
          </div>
          <div className="preview-module preview-adherence">
            <div className="preview-label"><span className="preview-icon preview-icon-violet"><Activity /></span><span>Adherence</span></div>
            <div className="adherence-row"><div className="adherence-ring"><strong>92</strong><small>%</small></div><div><strong>On track</strong><span>Last 7 days</span></div></div>
          </div>
          <div className="preview-module preview-vitals">
            <div className="preview-label"><span className="preview-icon preview-icon-cyan"><HeartPulse /></span><span>Vitals</span><small>Updated</small></div>
            <div className="vital-row"><div><span>Heart rate</span><strong>72 <small>bpm</small></strong></div><div><span>Blood pressure</span><strong>118/76</strong></div></div>
            <svg viewBox="0 0 260 38" aria-hidden="true"><path d="M0 24 C18 24 24 22 38 23 S55 26 68 22 L78 8 L88 31 L98 19 C111 22 120 23 137 21 S161 23 174 20 L183 13 L192 27 L202 21 C220 22 238 21 260 20" /></svg>
          </div>
        </div>
      </div>
      <div className="preview-team-float"><span className="team-avatars"><i>D</i><i>C</i></span><span><strong>Care team</strong><small><b /> Doctor & caregiver connected</small></span></div>
    </div>
  );
}

function Hero() {
  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero-copy landing-reveal">
        <div className="landing-eyebrow"><HeartPulse /> Connected healthcare, made clear</div>
        <h1 id="landing-title">Healthcare,<br /><span>finally in sync.</span></h1>
        <p>HealthSync brings medications, appointments, health records and coordinated care into one connected experience for patients, doctors and caregivers.</p>
        <div className="landing-hero-actions">
          <Link className="landing-button" to="/signup">Get started <ArrowRight /></Link>
          <a className="landing-button landing-button-secondary" href="#features">Explore platform <ChevronRight /></a>
        </div>
        <div className="landing-trust-row"><span><ShieldCheck /> Role-based access</span><span><Users /> Connected care</span><span><Activity /> Real-time health signals</span></div>
      </div>
      <CareOverview />
    </section>
  );
}

function Features() {
  return (
    <section className="landing-section capabilities-section" id="features" aria-labelledby="features-title">
      <div className="landing-section-heading"><div><span className="landing-kicker">Product capabilities</span><h2 id="features-title">Everything essential<br />to connected care.</h2></div><p>Purpose-built tools bring the daily details of healthcare into one coordinated experience.</p></div>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <article className={`feature-card ${index === features.length - 1 ? "feature-emergency" : ""}`} key={feature.title}>
            <span className="feature-icon"><feature.icon /></span>
            <div className="feature-content"><h3>{feature.title}</h3><p>{feature.text}</p></div>
            <span className="feature-detail">{feature.detail}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function MedicationShowcase() {
  const steps = [[AlarmClock, "Reminder"], [Check, "Response"], [Activity, "Adherence"], [Users, "Care visibility"]] as const;
  return (
    <section className="landing-section medication-section" id="how-it-works" aria-labelledby="medication-title">
      <div className="medication-copy"><span className="landing-kicker">Medication adherence</span><h2 id="medication-title">Support that goes<br />beyond the reminder.</h2><p>A simple daily action becomes useful care context, helping patients stay consistent and caregivers know when support matters.</p><div className="medication-flow" aria-label="Medication adherence workflow">{steps.map(([Icon, label], index) => <div className="flow-step" key={label}><span><Icon /></span><strong>{label}</strong>{index < steps.length - 1 && <ArrowRight aria-hidden="true" />}</div>)}</div></div>
      <div className="medication-demo" aria-label="Example medication reminder"><div className="demo-topline"><span><Pill /> Medication reminder</span><span className="demo-live"><i /> Due now</span></div><div className="demo-time"><strong>8:00</strong><span>AM</span></div><div className="demo-medication"><div><span>M</span><div><strong>Metformin</strong><small>1 tablet · 500 mg</small></div></div><span className="demo-schedule">After breakfast</span></div><div className="demo-actions"><button type="button" className="demo-taken"><Check /> Taken</button><button type="button">Snooze</button><button type="button">Skip</button></div><div className="demo-status"><Activity /><span><strong>Adherence updated</strong>Your care timeline is up to date.</span></div></div>
    </section>
  );
}

function Roles() {
  const [activeRole, setActiveRole] = useState(0);
  const role = roles[activeRole];
  const RoleIcon = role.icon;

  return (
    <section className="landing-section roles-section" id="connected-care" aria-labelledby="roles-title">
      <div className="roles-intro"><span className="landing-kicker">Connected care</span><h2 id="roles-title">Built around<br />every role.</h2><p>Everyone sees the right information for their part in the care journey—clear, focused and connected.</p></div>
      <div className="role-selector">
        <div className="role-tabs" role="tablist" aria-label="HealthSync roles">{roles.map((item, index) => <button type="button" role="tab" aria-selected={activeRole === index} className={`role-tab role-${item.tone} ${activeRole === index ? "is-active" : ""}`} onClick={() => setActiveRole(index)} onMouseEnter={() => setActiveRole(index)} key={item.title}><item.icon /><span>{item.title}</span></button>)}</div>
        <div className={`role-detail role-${role.tone}`} role="tabpanel"><span className="role-detail-icon"><RoleIcon /></span><div className="role-detail-copy"><span>HealthSync for</span><h3>{role.title}</h3><p>{role.summary}</p><ul>{role.items.map((item) => <li key={item}><Check /> {item}</li>)}</ul></div></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
      <section className="landing-cta" aria-labelledby="cta-title"><div><span className="landing-kicker">One connected experience</span><h2 id="cta-title">Better care starts<br />when everything connects.</h2><p>Bring the people and information behind better daily care into sync.</p></div><div className="landing-cta-actions"><Link className="landing-button" to="/signup">Get started <ArrowRight /></Link><Link className="landing-button landing-button-secondary" to="/login">Log in</Link></div></section>
      <footer className="landing-footer"><div><Brand /><p>Smart Digital Healthcare Platform</p></div><nav aria-label="Footer navigation"><a href="#features">Platform</a><a href="#features">Features</a><a href="#connected-care">Connected care</a><Link to="/login">Log in</Link></nav><span>© {new Date().getFullYear()} HealthSync</span></footer>
    </>
  );
}

export function LandingPage() {
  return <div className="healthsync-landing"><a className="skip-link" href="#main-content">Skip to content</a><Navbar /><main id="main-content"><Hero /><Features /><MedicationShowcase /><Roles /><Footer /></main></div>;
}
