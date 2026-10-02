import { Outlet } from "react-router-dom";
import {
  Bell,
  Bot,
  Calendar,
  ClipboardList,
  AlertTriangle,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { AppShell, type NavItem } from "../../components/layout/AppShell";

const navItems: NavItem[] = [
  { to: "/caregiver", label: "Overview", icon: LayoutDashboard, end: true, group: "Care workspace" },
  { to: "/caregiver/patients", label: "Patients", icon: Users, group: "Care workspace" },
  { to: "/caregiver/alerts", label: "Alerts", icon: Bell, group: "Care workspace" },
  { to: "/caregiver/appointments", label: "Appointments", icon: Calendar, group: "Care workspace" },
  { to: "/caregiver/reports", label: "Reports", icon: ClipboardList, group: "Care workspace" },
  { to: "/caregiver/ai", label: "AI Assistant", icon: Bot, group: "Care tools" },
  { to: "/caregiver/care-network", label: "Care Network", icon: Users, group: "Care tools" },
  { to: "/caregiver/emergencies", label: "Emergencies", icon: AlertTriangle, group: "Emergency" },
];

export function CaregiverLayout() {
  const storedUser = localStorage.getItem("healthsync_user");

  let caregiverName = "Caregiver";

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      caregiverName = user.name || "Caregiver";
    } catch {
      caregiverName = "Caregiver";
    }
  }

  return (
    <AppShell
      role="caregiver"
      navItems={navItems}
      userName={caregiverName}
    >
      <Outlet />
    </AppShell>
  );
}
