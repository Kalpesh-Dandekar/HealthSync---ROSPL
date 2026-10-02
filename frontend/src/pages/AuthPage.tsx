/// <reference types="vite/client" />
import { type FormEvent, type InputHTMLAttributes, type ReactNode, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  Pill,
  ShieldCheck,
  Stethoscope,
  Users,
  UserRound,
} from "lucide-react";
import "./auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
type AuthMode = "login" | "signup";
type Role = "PATIENT" | "CAREGIVER" | "PHYSICIAN";
type FieldErrors = Partial<Record<"name" | "email" | "password" | "confirmPassword", string>>;

const roleOptions = [
  { value: "PATIENT", label: "Patient", description: "Manage medications, appointments and health records.", icon: UserRound, tone: "cyan" },
  { value: "PHYSICIAN", label: "Doctor", description: "Coordinate appointments, prescriptions and patient care.", icon: Stethoscope, tone: "blue" },
  { value: "CAREGIVER", label: "Caregiver", description: "Support linked patients with adherence visibility and alerts.", icon: Users, tone: "violet" },
] as const;

function Brand() {
  return <Link className="auth-brand" to="/" aria-label="HealthSync home"><span className="auth-brand-mark"><HeartPulse /></span><span>Health<span>Sync</span></span></Link>;
}

function AuthInput({ id, label, icon, error, ...props }: { id: string; label: string; icon: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-error`;
  return <div className="auth-field"><label htmlFor={id}>{label}</label><div className={`auth-input-wrap ${error ? "has-error" : ""}`}><span className="auth-input-icon" aria-hidden="true">{icon}</span><input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} /></div>{error && <span className="auth-field-error" id={errorId}>{error}</span>}</div>;
}

function PasswordInput({ id, label, value, onChange, error, autoComplete, show, onToggle }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; autoComplete: string; show: boolean; onToggle: () => void }) {
  const errorId = `${id}-error`;
  return <div className="auth-field"><label htmlFor={id}>{label}</label><div className={`auth-input-wrap ${error ? "has-error" : ""}`}><span className="auth-input-icon" aria-hidden="true"><LockKeyhole /></span><input id={id} value={value} onChange={(event) => onChange(event.target.value)} type={show ? "text" : "password"} required minLength={6} autoComplete={autoComplete} placeholder="Enter at least 6 characters" aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} /><button className="password-toggle" type="button" onClick={onToggle} aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={show}>{show ? <EyeOff /> : <Eye />}</button></div>{error && <span className="auth-field-error" id={errorId}>{error}</span>}</div>;
}

function AuthBrandPanel() {
  return <aside className="auth-brand-panel"><Brand /><div className="auth-brand-copy"><span className="auth-kicker"><ShieldCheck /> Your HealthSync workspace</span><h1>Care stays<br /><span>connected.</span></h1><p>Bring medications, appointments, health records and care coordination into one focused workspace.</p></div><div className="care-status-card"><div className="care-status-heading"><div><span>Care status</span><strong>Today&apos;s overview</strong></div><span className="connected-status"><i /> Connected</span></div><div className="care-status-list"><div><span className="care-status-icon status-indigo"><Pill /></span><span><small>Medication</small><strong>Metformin · 8:00 AM</strong></span><span className="status-done"><Check /> Taken</span></div><div><span className="care-status-icon status-blue"><CalendarDays /></span><span><small>Next appointment</small><strong>Today · 10:30 AM</strong></span><ArrowRight /></div><div><span className="care-status-icon status-violet"><Users /></span><span><small>Care team</small><strong>Doctor & caregiver</strong></span><span className="status-online"><i /> Online</span></div></div></div><p className="auth-brand-foot"><Activity /> Connected care, made clear.</p></aside>;
}

function RoleSelector({ role, onChange, compact }: { role: Role; onChange: (role: Role) => void; compact: boolean }) {
  return <fieldset className={`auth-role-fieldset ${compact ? "is-compact" : ""}`}><legend>{compact ? "Workspace role" : "Choose your role"}</legend><div className="auth-role-options">{roleOptions.map((option) => <button className={`auth-role-option role-${option.tone} ${role === option.value ? "is-selected" : ""}`} type="button" aria-pressed={role === option.value} onClick={() => onChange(option.value)} key={option.value}><span className="auth-role-icon"><option.icon /></span><span><strong>{option.label}</strong>{!compact && <small>{option.description}</small>}</span>{role === option.value && <Check className="role-check" />}</button>)}</div>{compact && <p>The server verifies the selected role before sign-in.</p>}</fieldset>;
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<Role>(() => {
    const selected = (searchParams.get("role") || "PATIENT").toUpperCase();
    return (["PATIENT", "CAREGIVER", "PHYSICIAN"] as const).includes(selected as Role) ? selected as Role : "PATIENT";
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function validate() {
    const nextErrors: FieldErrors = {};
    if (!isLogin && !name.trim()) nextErrors.name = "Enter your full name.";
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Password must contain at least 6 characters.";
    if (!isLogin && password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!validate()) return;
    setBusy(true);

    try {
      const response = await fetch(`${API_URL}/auth/${isLogin ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? { email, password, role } : { name, email, password, role }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || (isLogin ? "Incorrect email or password." : "Unable to create the account."));

      localStorage.setItem("healthsync_token", data.token);
      localStorage.setItem("healthsync_role", data.user.role);
      localStorage.setItem("healthsync_user", JSON.stringify(data.user));
      navigate(`/${data.user.role}`);
    } catch (error) {
      setMessage(error instanceof TypeError ? "Unable to connect to HealthSync. Please try again." : error instanceof Error ? error.message : "Unable to complete the request.");
    } finally {
      setBusy(false);
    }
  }

  const switchPath = `${isLogin ? "/signup" : "/login"}?role=${role.toLowerCase()}`;

  return <main className={`auth-page ${isLogin ? "auth-login" : "auth-signup"}`}><AuthBrandPanel /><section className="auth-workspace" aria-labelledby="auth-title"><div className="auth-mobile-header"><Brand /><Link to="/" aria-label="Back to HealthSync home"><ArrowLeft /></Link></div><div className="auth-form-shell"><Link className="auth-back-link" to="/"><ArrowLeft /> Back to HealthSync</Link><div className="auth-heading"><span className="auth-kicker">{isLogin ? "HealthSync access" : "Create your workspace"}</span><h2 id="auth-title">{isLogin ? "Welcome back" : "Create your HealthSync account"}</h2><p>{isLogin ? "Sign in to continue to your HealthSync workspace." : "Join your connected care workspace in a few simple steps."}</p></div><form onSubmit={handleSubmit} noValidate>{!isLogin && <AuthInput id="full-name" label="Full name" icon={<UserRound />} value={name} onChange={(event) => { setName(event.target.value); clearError("name"); }} error={errors.name} required autoComplete="name" placeholder="Your full name" />}<AuthInput id="email" label="Email address" icon={<Mail />} value={email} onChange={(event) => { setEmail(event.target.value); clearError("email"); }} error={errors.email} type="email" required autoComplete="email" placeholder="you@example.com" />
        <PasswordInput id="password" label="Password" value={password} onChange={(value) => { setPassword(value); clearError("password"); }} error={errors.password} autoComplete={isLogin ? "current-password" : "new-password"} show={showPassword} onToggle={() => setShowPassword((current) => !current)} />
        {!isLogin && <><PasswordInput id="confirm-password" label="Confirm password" value={confirmPassword} onChange={(value) => { setConfirmPassword(value); clearError("confirmPassword"); }} error={errors.confirmPassword} autoComplete="new-password" show={showConfirmPassword} onToggle={() => setShowConfirmPassword((current) => !current)} /><p className={`password-requirement ${password.length >= 6 ? "is-met" : ""}`}><Check /> At least 6 characters</p></>}
        <RoleSelector role={role} onChange={setRole} compact={isLogin} />
        {message && <div className="auth-message" role="alert"><span>!</span><p>{message}</p></div>}
        <button className="auth-submit" type="submit" disabled={busy} aria-busy={busy}>{busy ? <><span className="auth-spinner" aria-hidden="true" />{isLogin ? "Signing in..." : "Creating account..."}</> : <>{isLogin ? "Sign in" : "Create account"}<ArrowRight /></>}</button>
      </form><p className="auth-switch">{isLogin ? "New to HealthSync?" : "Already have an account?"} <Link to={switchPath}>{isLogin ? "Create account" : "Log in"}</Link></p><p className="auth-disclaimer">HealthSync is a student project prototype and is not a substitute for professional medical advice.</p></div></section></main>;
}
