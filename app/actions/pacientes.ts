'use server'

// MUDANÇA AQUI: Importamos do nosso arquivo lib/prisma em vez de criar um novo
import { prisma } from "@/lib/prisma" 
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string
  const cpf = formData.get("cpf") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  
  const birthDateRaw = formData.get("birthDate") as string
  const birthDate = birthDateRaw ? new Date(birthDateRaw) : null

  await prisma.patient.create({
    data: {
      name,
      cpf,
      phone,
      birthDate
    }
  })

  revalidatePath("/dashboard/pacientes")
  redirect("/dashboard/pacientes")
}