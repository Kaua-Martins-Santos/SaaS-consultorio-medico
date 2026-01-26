import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { parseISO, isValid } from "date-fns"

// Tem que ser igual ao do Bot
const API_SECRET = "minha-senha-secreta-123"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { secret, name, phone, dateIso, tenantId } = body

    // 1. Segurança
    if (secret !== API_SECRET) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
    }

    if (!tenantId || !phone || !dateIso) {
      return NextResponse.json({ error: "Dados faltando" }, { status: 400 })
    }

    // 2. Acha ou Cria Paciente
    const cleanPhone = phone.replace(/\D/g, "")
    let patient = await prisma.patient.findFirst({
      where: { phone: { contains: cleanPhone }, tenantId }
    })

    if (!patient) {
      patient = await prisma.patient.create({
        data: { name, phone: cleanPhone, tenantId }
      })
    }

    // 3. Verifica Data
    const appointmentDate = parseISO(dateIso)
    if (!isValid(appointmentDate)) {
      return NextResponse.json({ error: "Data inválida" }, { status: 400 })
    }

    // 4. Acha Médico ou Dono
    const doctor = await prisma.user.findFirst({
      where: { 
        tenantId,
        OR: [{ role: "DOCTOR" }, { role: "OWNER" }]
      }
    })

    if (!doctor) {
      return NextResponse.json({ error: "Sem médico disponível" }, { status: 404 })
    }

    // 5. Verifica se horário está livre
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        date: appointmentDate,
        status: { notIn: ["CANCELLED", "NO_SHOW"] }
      }
    })

    if (conflict) {
      return NextResponse.json({ error: "Horário ocupado" }, { status: 409 })
    }

    // 6. Cria Agendamento
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        status: "PENDING",
        notes: "Agendado pelo Bot WhatsApp",
        patientId: patient.id,
        doctorId: doctor.id,
        tenantId
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: appointment.id, 
      doctor: doctor.name 
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}