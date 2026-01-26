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
      tenant: true,
      availabilities: true // AGORA TRAZEMOS OS HORÁRIOS TAMBÉM
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

  // 1. Dados Básicos
  const name = formData.get("name") as string
  const specialty = formData.get("specialty") as string
  const crm = formData.get("crm") as string
  const clinicName = formData.get("clinicName") as string
  const clinicPhone = formData.get("clinicPhone") as string
  const clinicLogo = formData.get("clinicLogo") as string
  const clinicAddress = formData.get("clinicAddress") as string

  try {
    // A. Atualiza Perfil e Clínica
    await prisma.user.update({
      where: { id: userId },
      data: { name, specialty, crm }
    })

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: clinicName,
        whatsappPhone: clinicPhone,
        logoUrl: clinicLogo,
        address: clinicAddress
      }
    })

    // B. Atualiza Horários de Atendimento (Estratégia: Limpar e Recriar)
    // Primeiro, deletamos todos os horários antigos desse médico
    await prisma.availability.deleteMany({
      where: { userId: userId }
    })

    // Agora criamos os novos baseado no formulário
    const diasDaSemana = [0, 1, 2, 3, 4, 5, 6]; // 0=Domingo, 1=Segunda...
    const novosHorarios = [];

    for (const dia of diasDaSemana) {
        const ativo = formData.get(`day_${dia}_active`) === "on";
        const inicio = formData.get(`day_${dia}_start`) as string;
        const fim = formData.get(`day_${dia}_end`) as string;

        if (ativo && inicio && fim) {
            novosHorarios.push({
                userId,
                dayOfWeek: dia,
                startTime: inicio,
                endTime: fim
            });
        }
    }

    if (novosHorarios.length > 0) {
        await prisma.availability.createMany({
            data: novosHorarios
        });
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/configuracoes")
    
    return { success: true }

  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    return { success: false, error: "Erro ao salvar" }
  }
}