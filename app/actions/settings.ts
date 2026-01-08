'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getDoctorSettings() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  // @ts-ignore
  const userId = session.user.id

  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenant: true // Traz os dados da clínica junto
    }
  })
}

export async function updateSettings(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return

  // @ts-ignore
  const userId = session.user.id
  // @ts-ignore
  const tenantId = session.user.tenantId

  // 1. Dados do Médico
  const name = formData.get("name") as string
  const specialty = formData.get("specialty") as string
  const crm = formData.get("crm") as string

  // 2. Dados da Clínica
  const clinicName = formData.get("clinicName") as string
  const clinicPhone = formData.get("clinicPhone") as string
  const clinicLogo = formData.get("clinicLogo") as string
  const clinicAddress = formData.get("clinicAddress") as string // <--- Novo

  try {
    // Atualiza o Médico
    await prisma.user.update({
      where: { id: userId },
      data: { name, specialty, crm }
    })

    // Atualiza a Clínica (Tenant)
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: clinicName,
        whatsappPhone: clinicPhone,
        logoUrl: clinicLogo,
        address: clinicAddress // <--- Salvando o endereço agora!
      }
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/configuracoes")
    revalidatePath("/dashboard/agenda")
    
    return { success: true }

  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    return { success: false, error: "Erro ao salvar" }
  }
}