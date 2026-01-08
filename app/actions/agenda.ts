'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { startOfDay, endOfDay, addDays } from "date-fns"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Helper para pegar a sessão do usuário logado
async function getSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  return session.user
}

export async function createAppointment(formData: FormData) {
  const user = await getSession()
  
  // Se não estiver logado, não deixa criar
  if (!user) return 

  const patientId = formData.get("patientId") as string
  const dateStr = formData.get("date") as string
  const notes = formData.get("notes") as string
  const price = formData.get("price") as string 

  if (!patientId || !dateStr) return

  // CORREÇÃO: Agora passamos o tenantId obrigatório
  await prisma.appointment.create({
    data: {
      date: new Date(dateStr),
      status: "PENDING",
      notes: notes,
      price: price ? parseFloat(price) : 0, 
      patientId: patientId,
      
      // 1. Vincula ao médico logado (sessão)
      // @ts-ignore
      doctorId: user.id,

      // 2. Vincula à Clínica (Tenant) - RESOLVE O ERRO
      // @ts-ignore
      tenantId: user.tenantId 
    }
  })

  revalidatePath("/dashboard/agenda")
  revalidatePath("/dashboard")
  redirect("/dashboard/agenda")
}

// --- OUTRAS FUNÇÕES (Também precisam de proteção por Tenant) ---

export async function updateStatus(formData: FormData) {
    const user = await getSession()
    if (!user) return

    const id = formData.get("id") as string
    const newStatus = formData.get("status") as string

    if (!id || !newStatus) return

    // Garante que só edita se for da mesma clínica
    await prisma.appointment.update({
        where: { 
            id,
            // @ts-ignore
            tenantId: user.tenantId // Filtro de segurança
        },
        data: { status: newStatus as any }
    })

    revalidatePath("/dashboard/agenda")
    revalidatePath("/dashboard")
}

export async function deleteAppointment(formData: FormData) {
    const user = await getSession()
    if (!user) return

    const id = formData.get("id") as string
    if (!id) return

    await prisma.appointment.delete({ 
        where: { 
            id, 
            // @ts-ignore
            tenantId: user.tenantId // Filtro de segurança
        } 
    })
    
    revalidatePath("/dashboard/agenda")
    revalidatePath("/dashboard")
}

export async function getAppointments(filter: string = "today") {
    const user = await getSession()
    if (!user) return []

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
            gte: today
        }
    }

    return await prisma.appointment.findMany({
        where: {
            // @ts-ignore
            tenantId: user.tenantId, // CRÍTICO: Só mostra agenda desta clínica
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