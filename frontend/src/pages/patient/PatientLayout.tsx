import { Outlet } from "react-router-dom";
import { Bot, Calendar, ClipboardList, FileText, HeartPulse, LayoutDashboard, Pill, Users } from "lucide-react";
import { AppShell, type NavItem } from "../../components/layout/AppShell";
import "./patient-clinical.css";
import { useAppData } from "../../data/AppDataContext";
const navItems:NavItem[]=[
 {to:"/patient",label:"Overview",icon:LayoutDashboard,end:true,group:"My health"},
 {to:"/patient/add-data",label:"Medications",icon:Pill,group:"My health"},
 {to:"/patient/appointments",label:"Appointments",icon:Calendar,group:"My health"},
 {to:"/patient/vitals",label:"Vitals",icon:HeartPulse,group:"My health"},
 {to:"/patient/records",label:"Records",icon:FileText,group:"Health intelligence"},
 {to:"/patient/reports",label:"Reports",icon:ClipboardList,group:"Health intelligence"},
 {to:"/patient/ai",label:"AI Assistant",icon:Bot,group:"Health intelligence"},
 {to:"/patient/care-network",label:"Care Network",icon:Users,group:"Care team"},
];
export function PatientLayout(){const{patient}=useAppData();return <AppShell role="patient" navItems={navItems} userName={patient.name||"Patient"}><Outlet/></AppShell>}
