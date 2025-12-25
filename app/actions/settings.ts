'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Função para atualizar os dados do Médico
export async function updateSettings(formData: FormData) {
  // Pegamos o primeiro usuário (no nosso MVP é você, o Dr. Admin)
  const user = await prisma.user.findFirst()

  if (!user) return;

  const name = formData.get("name") as string
  const specialty = formData.get("specialty") as string
  const crm = formData.get("crm") as string

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      specialty,
      crm
    }
  })

  revalidatePath("/dashboard/configuracoes")
  revalidatePath("/dashboard/pacientes/[id]/receita") // Atualiza a receita também
}

// Função para buscar os dados (usaremos na receita depois)
export async function getDoctorSettings() {
    const user = await prisma.user.findFirst();
    return user;
}