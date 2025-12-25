'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createAppointment(formData: FormData) {
  const patientId = formData.get("patientId") as string
  const dateStr = formData.get("date") as string
  const notes = formData.get("notes") as string

  if (!patientId || !dateStr) {
    return
  }

  // 1. Validação de Data no Servidor
  const appointmentDate = new Date(dateStr)
  const now = new Date()

  // Se a data do agendamento for menor que "agora", cancela tudo.
  if (appointmentDate < now) {
    // Como estamos numa Server Action simples, o return apenas não faz nada.
    // O usuário clicaria e não sairia da tela.
    return 
  }

  // 2. Busca ou Cria o Médico (Mock para funcionar sem login)
  let doctor = await prisma.user.findFirst()
  
  if (!doctor) {
    doctor = await prisma.user.create({
      data: {
        name: "Dr. Admin",
        email: "admin@medico.com",
        password: "123", 
        role: "DOCTOR"
      }
    })
  }

  // 3. Cria o agendamento
  await prisma.appointment.create({
    data: {
      date: appointmentDate,
      status: "PENDING",
      notes: notes,
      patientId: patientId,
      doctorId: doctor.id
    }
  })

  revalidatePath("/dashboard/agenda")
  revalidatePath("/dashboard")
  redirect("/dashboard/agenda")
}