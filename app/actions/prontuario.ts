'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Simulação de Upload (Substituir por S3/R2/Uploadthing depois)
async function uploadFileToStorage(file: File): Promise<string> {
  // Aqui você usaria: await s3Client.send(new PutObjectCommand(...))
  console.log(`[MOCK UPLOAD] Enviando arquivo: ${file.name} (${file.size} bytes)`)
  
  // Simulando delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Retorna uma URL falsa para teste
  return `https://fake-storage.com/${Date.now()}-${file.name}`
}

export async function createMedicalRecord(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return

  const patientId = formData.get("patientId") as string
  const description = formData.get("description") as string
  const file = formData.get("file") as File | null

  if (!patientId || !description) return

  // @ts-ignore
  const tenantId = session.user.tenantId
  // @ts-ignore
  const doctorId = session.user.id

  try {
    // 1. Se tiver arquivo, faz o upload
    let attachmentData = undefined
    
    if (file && file.size > 0) {
      const url = await uploadFileToStorage(file)
      attachmentData = {
        create: {
            name: file.name,
            type: file.type,
            url: url
        }
      }
    }

    // 2. Salva no Banco (Prontuário + Anexo opcional)
    await prisma.medicalRecord.create({
      data: {
        description,
        patientId,
        doctorId, // O médico logado
        // @ts-ignore - Se seu schema não tiver tenantId no MedicalRecord, remova esta linha. 
        // Mas o ideal é ter tenantId em TUDO para segurança. Se não tiver, o prisma vai ignorar ou dar erro se for strict.
        // Assumindo que MedicalRecord é acessado via Patient (que tem Tenant), está ok por enquanto.
        attachments: attachmentData 
      }
    })

    revalidatePath(`/dashboard/pacientes/${patientId}`)
    return { success: true }

  } catch (error) {
    console.error("Erro ao criar prontuário:", error)
    return { success: false, error: "Falha ao salvar" }
  }
}