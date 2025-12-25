import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReceitaSimples from "@/app/components/receita-simples";

export default async function ReceitaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Busca os dados do paciente
  const patient = await prisma.patient.findUnique({
    where: { id }
  });

  if (!patient) return notFound();

  // 2. Busca os dados do médico (Admin)
  // Como é um sistema simples por enquanto, pegamos o primeiro usuário que for médico
  const doctor = await prisma.user.findFirst();

  return (
    <ReceitaSimples 
      patientId={patient.id}
      patientName={patient.name}
      doctorName={doctor?.name || "Dr. Não Cadastrado"}
      crm={doctor?.crm || ""}
      clinicName={doctor?.clinicName || "Consultório Médico"}
      clinicAddress={doctor?.clinicAddress || "Endereço não configurado"}
      clinicPhone={doctor?.clinicPhone || "Telefone não configurado"}
    />
  );
}