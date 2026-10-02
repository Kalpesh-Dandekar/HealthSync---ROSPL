import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronRight, HeartPulse, LogOut, Menu, ShieldCheck, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { UserRole } from "../../types";
import "./app-shell.css";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  group?: string;
}

const roleLabels: Record<UserRole, string> = {
  patient: "Patient",
  caregiver: "Caregiver",
  doctor: "Physician",
};

const roleDescriptions: Record<UserRole, string> = {
  patient: "Your personal health space",
  caregiver: "Connected care overview",
  doctor: "Clinical monitoring workspace",
};

export function AppShell({
  role,
  navItems,
  userName,
  children,
}: {
  role: UserRole;
  navItems: NavItem[];
  userName: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleLabel = roleLabels[role];
  const groups = navItems.reduce<Array<{ label: string; items: NavItem[] }>>((result, item) => {
    const label = item.group || "Workspace";
    const current = result.find((group) => group.label === label);
    if (current) current.items.push(item);
    else result.push({ label, items: [item] });
    return result;
  }, []);

  const logout = () => {
    localStorage.removeItem("healthsync_token");
    localStorage.removeItem("healthsync_role");
    localStorage.removeItem("healthsync_user");
    navigate("/");
  };

  return (
    <div className="app-shell h-screen overflow-hidden text-charcoal-900 lg:flex">
      {/* Desktop navigation */}
      <aside className="app-sidebar hidden w-[272px] min-h-0 shrink-0 flex-col lg:flex">
        <div className="app-brand px-5 py-5">
          <button onClick={() => navigate(`/${role}`)} className="flex items-center gap-3 text-left">
            <span className="app-brand-mark flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[15px] font-bold tracking-tight">HealthSync</span>
              <span className="app-kicker mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em]">Connected care</span>
            </span>
          </button>
        </div>

        <div className="app-workspace mx-4 mt-5 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="app-kicker text-[10px] font-semibold uppercase tracking-[0.16em]">Workspace</span>
            <span className="app-live flex items-center gap-1.5 text-[10px] font-semibold"><ShieldCheck className="h-3.5 w-3.5" />Secure</span>
          </div>
          <p className="mt-2 text-sm font-semibold">{roleLabel}</p>
          <p className="app-muted mt-1 text-xs leading-relaxed">{roleDescriptions[role]}</p>
        </div>

        <nav className="app-nav min-h-0 flex-1 overflow-y-auto px-3 py-5">
          {groups.map((group) => <div key={group.label} className="mb-5 last:mb-0">
          <p className="app-kicker px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em]">{group.label}</p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `app-nav-link group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "is-active"
                      : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="app-nav-icon flex h-8 w-8 items-center justify-center rounded-lg">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          </div>)}
        </nav>

        <div className="app-profile shrink-0 p-4">
          <div className="app-user flex items-center gap-3 rounded-xl p-3">
            <div className="app-avatar flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="app-muted text-[10px] uppercase tracking-wide">{roleLabel}</p>
            </div>
          </div>
          <button onClick={logout} className="app-logout mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium">
            <LogOut className="h-3.5 w-3.5" /> Switch workspace
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="app-mobile-header sticky top-0 z-50 flex items-center justify-between px-4 py-3 backdrop-blur lg:hidden">
        <button onClick={() => navigate(`/${role}`)} className="flex items-center gap-2.5 text-left">
          <span className="app-brand-mark flex h-9 w-9 items-center justify-center rounded-xl text-white"><HeartPulse className="h-4.5 w-4.5" /></span>
          <span><span className="block text-sm font-bold">HealthSync</span><span className="app-kicker block text-[9px] font-semibold uppercase tracking-[0.16em]">{roleLabel}</span></span>
        </button>
        <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="app-menu-button rounded-xl p-2.5">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/70" />
          <div className="app-drawer absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col p-4 shadow-2xl">
            <div className="app-brand flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5"><span className="app-brand-mark flex h-9 w-9 items-center justify-center rounded-xl text-white"><HeartPulse className="h-4 w-4" /></span><span className="font-bold">HealthSync</span></div>
              <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 text-charcoal-500 hover:bg-paper-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="app-workspace mt-5 rounded-2xl p-4"><p className="app-kicker text-xs font-semibold uppercase tracking-wider">{roleLabel} workspace</p><p className="app-muted mt-1 text-sm">{roleDescriptions[role]}</p></div>
            <nav className="mt-5 space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)} className={({isActive}) => `app-nav-link flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold ${isActive ? "is-active" : ""}`}>
                  <item.icon className="h-5 w-5" />{item.label}
                </NavLink>
              ))}
            </nav>
            <div className="app-profile mt-auto pt-4">
              <button onClick={logout} className="app-user flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold"><LogOut className="h-4 w-4" />Switch workspace</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="app-ambient pointer-events-none fixed inset-0 -z-0" />
        <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-4 lg:px-6 lg:pb-5 lg:pt-5">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>


      </div>
    </div>
  );
}
