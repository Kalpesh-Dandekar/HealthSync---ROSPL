import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing in backend/.env");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const first = async () => {
  const patient = await prisma.user.findFirst({ where: { role: "PATIENT" }, orderBy: { id: "asc" } });
  const caregiver = await prisma.user.findFirst({ where: { role: "CAREGIVER" }, orderBy: { id: "asc" } });
  const physician = await prisma.user.findFirst({ where: { role: "PHYSICIAN" }, orderBy: { id: "asc" } });
  if (!patient || !caregiver || !physician) throw new Error("Need at least one PATIENT, CAREGIVER and PHYSICIAN account.");
  for (const data of [{ patientId: patient.id, caregiverId: caregiver.id }, { patientId: patient.id, physicianId: physician.id }]) {
    const existing = await prisma.careConnection.findFirst({ where: data });
    if (!existing) await prisma.careConnection.create({ data });
  }
  console.log(`Connected patient ${patient.name} with caregiver ${caregiver.name} and physician ${physician.name}.`);
};
first().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>prisma.$disconnect());
