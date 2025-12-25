'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Busca os dados do médico atual
export async function getDoctorSettings() {
  // Em produção, pegaria o ID da sessão. 
  // Aqui pegamos o primeiro usuário (Admin)
  return await prisma.user.findFirst()
}

// Atualiza os dados
export async function updateSettings(formData: FormData) {
  const name = formData.get("name") as string
  const specialty = formData.get("specialty") as string
  const crm = formData.get("crm") as string
  const clinicName = formData.get("clinicName") as string
  const clinicAddress = formData.get("clinicAddress") as string
  const clinicPhone = formData.get("clinicPhone") as string

  // Pega o ID do médico (mesma lógica do get)
  const doctor = await prisma.user.findFirst()

  if (!doctor) return

  await prisma.user.update({
    where: { id: doctor.id },
    data: {
      name,
      specialty,
      crm,
      clinicName,
      clinicAddress,
      clinicPhone
    }
  })

  // Atualiza todas as páginas para refletir a mudança
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/configuracoes")
  revalidatePath("/dashboard/agenda")
}