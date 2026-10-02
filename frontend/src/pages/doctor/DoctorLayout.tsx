import { Outlet } from "react-router-dom";
import {
  AlertTriangle,
  Bot,
  Calendar,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Users2,
} from "lucide-react";
import { AppShell, type NavItem } from "../../components/layout/AppShell";

const navItems: NavItem[] = [
  { to: "/doctor", label: "Overview", icon: LayoutDashboard, end: true, group: "Clinical workspace" },
  { to: "/doctor/patients", label: "Patients", icon: Users2, group: "Clinical workspace" },
  { to: "/doctor/appointments", label: "Appointments", icon: Calendar, group: "Clinical workspace" },
  { to: "/doctor/reports", label: "Reports", icon: ClipboardList, group: "Clinical workspace" },
  { to: "/doctor/ai", label: "AI Assistant", icon: Bot, group: "Clinical tools" },
  { to: "/doctor/care-network", label: "Care Network", icon: FileText, group: "Clinical tools" },
  { to: "/doctor/emergencies", label: "Emergencies", icon: AlertTriangle, group: "Emergency" },
];

export function DoctorLayout() {
  const storedUser = localStorage.getItem("healthsync_user");

  let doctorName = "Doctor";

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      doctorName = user.name || "Doctor";
    } catch {
      doctorName = "Doctor";
    }
  }

  return (
    <AppShell
      role="doctor"
      navItems={navItems}
      userName={doctorName}
    >
      <Outlet />
    </AppShell>
  );
}
