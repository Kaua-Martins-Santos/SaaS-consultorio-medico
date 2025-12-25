'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const cpf = formData.get("cpf") as string
  const phone = formData.get("phone") as string
  const birthDate = formData.get("birthDate") as string

  if (!name || !cpf || !phone) {
    return
  }

  await prisma.patient.create({
    data: {
      name,
      email,
      cpf,
      phone,
      birthDate: birthDate ? new Date(birthDate) : null,
    },
  })

  revalidatePath("/dashboard/pacientes")
  redirect("/dashboard/pacientes")
}

// --- NOVAS FUNÇÕES ---

// Busca pacientes filtrando pelo nome ou CPF
export async function getPatients(query: string = "") {
    // Se não tiver busca, retorna os últimos 20
    if (!query) {
        return await prisma.patient.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        })
    }

    // Se tiver busca, filtra
    return await prisma.patient.findMany({
        where: {
            OR: [
                { name: { contains: query } }, // Filtra por nome
                { cpf: { contains: query } }   // Ou por CPF
            ]
        },
        orderBy: { name: 'asc' }
    })
}

// Excluir Paciente
export async function deletePatient(formData: FormData) {
    const id = formData.get("id") as string
    
    if (!id) return;

    try {
        await prisma.patient.delete({
            where: { id }
        })
        revalidatePath("/dashboard/pacientes")
    } catch (error) {
        console.error("Erro ao excluir", error)
    }
}