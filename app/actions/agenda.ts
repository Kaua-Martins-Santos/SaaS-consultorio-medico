'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createAppointment(formData: FormData) {
  const patientId = formData.get("patientId") as string
  const dateStr = formData.get("date") as string
  const notes = formData.get("notes") as string
  
  // --- ADICIONEI ISSO AQUI ---
  const price = formData.get("price") as string 
  // ---------------------------

  if (!patientId || !dateStr) {
    return
  }

  // 1. Validação de Data no Servidor
  const appointmentDate = new Date(dateStr)
  const now = new Date()

  if (appointmentDate < now) {
    return 
  }

  // 2. Busca ou Cria o Médico
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

  // 3. Cria o agendamento COM O PREÇO
  await prisma.appointment.create({
    data: {
      date: appointmentDate,
      status: "PENDING",
      notes: notes,
      
      // --- E ISSO AQUI NO FINAL ---
      // Converte o texto "150.00" para número real. Se estiver vazio, salva 0.
      price: price ? parseFloat(price) : 0, 
      // ----------------------------

      patientId: patientId,
      doctorId: doctor.id
    }
  })

  revalidatePath("/dashboard/agenda")
  revalidatePath("/dashboard")
  // Atualiza o financeiro também para o valor aparecer na hora
  revalidatePath("/dashboard/financeiro") 
  redirect("/dashboard/agenda")
}