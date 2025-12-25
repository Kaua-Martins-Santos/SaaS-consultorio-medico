'use server'

// MUDANÇA AQUI: Importamos do nosso arquivo lib/prisma em vez de criar um novo
import { prisma } from "@/lib/prisma" 
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string
  const cpf = formData.get("cpf") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  
  const birthDateRaw = formData.get("birthDate") as string
  const birthDate = birthDateRaw ? new Date(birthDateRaw) : null

  await prisma.patient.create({
    data: {
      name,
      cpf,
      phone,
      birthDate
    }
  })

  revalidatePath("/dashboard/pacientes")
  redirect("/dashboard/pacientes")
}

export async function saveMedicalRecord(formData: FormData) {
  const patientId = formData.get("patientId") as string
  const description = formData.get("description") as string

  if (!description || description.trim() === "") {
    return;
  }

  await prisma.medicalRecord.create({
    data: {
      patientId,
      description,
    }
  })

  // Atualiza a tela do prontuário para mostrar a nova mensagem na hora
  revalidatePath(`/dashboard/pacientes/${patientId}`)
}

// ... (código anterior continua igual)

export async function updatePatient(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string // <--- Pegamos o email
  const cpf = formData.get("cpf") as string
  const phone = formData.get("phone") as string
  
  await prisma.patient.update({
    where: { id },
    data: {
      name,
      email,
      cpf,
      phone,
    }
  })

  revalidatePath(`/dashboard/pacientes/${id}`)
  redirect(`/dashboard/pacientes/${id}`)
}

export async function deletePatient(formData: FormData) {
  const id = formData.get("id") as string

  // 1. Apaga agendamentos e histórico desse paciente primeiro
  await prisma.appointment.deleteMany({ where: { patientId: id } })
  await prisma.medicalRecord.deleteMany({ where: { patientId: id } })

  // 2. Agora sim, apaga o paciente
  await prisma.patient.delete({ where: { id } })

  redirect("/dashboard/pacientes")
}