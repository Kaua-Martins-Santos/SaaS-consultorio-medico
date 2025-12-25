'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { startOfDay, endOfDay, addDays } from "date-fns"

export async function createAppointment(formData: FormData) {
  // ... (mantenha seu código de createAppointment aqui igual ao anterior) ...
  // Vou abreviar para focar nas novas funções
  const patientId = formData.get("patientId") as string
  const dateStr = formData.get("date") as string
  const notes = formData.get("notes") as string
  const price = formData.get("price") as string 

  if (!patientId || !dateStr) return

  let doctor = await prisma.user.findFirst()
  // ... lógica de criar médico se não existir ...

  await prisma.appointment.create({
    data: {
      date: new Date(dateStr),
      status: "PENDING",
      notes: notes,
      price: price ? parseFloat(price) : 0, 
      patientId: patientId,
      doctorId: doctor?.id || "" // Ajuste conforme seu create anterior
    }
  })

  revalidatePath("/dashboard/agenda")
  revalidatePath("/dashboard")
  redirect("/dashboard/agenda")
}

// --- NOVAS FUNÇÕES DE AÇÃO ---

export async function updateStatus(formData: FormData) {
    const id = formData.get("id") as string
    const newStatus = formData.get("status") as string

    if (!id || !newStatus) return

    await prisma.appointment.update({
        where: { id },
        data: { status: newStatus }
    })

    revalidatePath("/dashboard/agenda")
    revalidatePath("/dashboard")
}

export async function deleteAppointment(formData: FormData) {
    const id = formData.get("id") as string
    if (!id) return

    await prisma.appointment.delete({ where: { id } })
    revalidatePath("/dashboard/agenda")
    revalidatePath("/dashboard")
}

// Busca agendamentos com Filtro de Data
export async function getAppointments(filter: string = "today") {
    let dateFilter = {}
    const today = startOfDay(new Date())

    if (filter === "today") {
        dateFilter = {
            gte: today,
            lte: endOfDay(today)
        }
    } else if (filter === "tomorrow") {
        const tomorrow = addDays(today, 1)
        dateFilter = {
            gte: startOfDay(tomorrow),
            lte: endOfDay(tomorrow)
        }
    } else if (filter === "upcoming") {
        dateFilter = {
            gte: today // Do hoje para frente
        }
    }
    // se for "all", não aplica filtro de data

    return await prisma.appointment.findMany({
        where: {
            date: dateFilter
        },
        include: {
            patient: true,
        },
        orderBy: {
            date: 'asc',
        }
    })
}