'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Busca os dados do médico atual
export async function getDoctorSettings() {
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
  
  // AQUI: Pegamos o campo novo que vinha do formulário mas era ignorado
  const clinicLogo = formData.get("clinicLogo") as string 

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
      clinicPhone,
      clinicLogo // AQUI: Mandamos salvar no banco
    }
  })

  // Atualiza as páginas
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/configuracoes")
  revalidatePath("/dashboard/agenda")
}