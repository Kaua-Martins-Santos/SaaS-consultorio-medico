import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { parseISO, isValid, addMinutes, isBefore, startOfHour, setHours, setMinutes, getDay, format } from "date-fns"

// Tem que ser igual ao do Bot
const API_SECRET = "minha-senha-secreta-123"
const APPOINTMENT_DURATION = 30; // Duração padrão em minutos

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

    // 3. Validação de Data Básica
    const appointmentDate = parseISO(dateIso)
    if (!isValid(appointmentDate)) {
      return NextResponse.json({ error: "Data inválida" }, { status: 400 })
    }

    if (isBefore(appointmentDate, new Date())) {
        return NextResponse.json({ error: "Data no passado" }, { status: 400 })
    }

    // 4. Acha Médico (Prioriza DOCTOR, fallback para OWNER)
    const doctor = await prisma.user.findFirst({
      where: { 
        tenantId,
        OR: [{ role: "DOCTOR" }, { role: "OWNER" }]
      },
      include: {
        availabilities: true // Traz os horários de trabalho
      }
    })

    if (!doctor) {
      return NextResponse.json({ error: "Sem médico disponível" }, { status: 404 })
    }

    // --- LÓGICA DE DISPONIBILIDADE E SUGESTÃO ---

    // Função para verificar se um horário específico está livre
    const isSlotAvailable = async (date: Date) => {
        // 1. Verifica Expediente (Availability)
        // Se o médico não tiver disponibilidade configurada, assumimos Seg-Sex 08:00-18:00
        let isWorkingHours = false;
        
        if (doctor.availabilities.length > 0) {
            const dayOfWeek = getDay(date); // 0 = Domingo, 1 = Segunda...
            const availability = doctor.availabilities.find(a => a.dayOfWeek === dayOfWeek);
            
            if (availability) {
                const [startHour, startMin] = availability.startTime.split(':').map(Number);
                const [endHour, endMin] = availability.endTime.split(':').map(Number);
                
                const startWork = setMinutes(setHours(date, startHour), startMin);
                const endWork = setMinutes(setHours(date, endHour), endMin);
                
                if (date >= startWork && date < endWork) {
                    isWorkingHours = true;
                }
            }
        } else {
            // Fallback: Seg a Sex, 09h as 18h
            const day = getDay(date);
            const hour = date.getHours();
            if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
                isWorkingHours = true;
            }
        }

        if (!isWorkingHours) return "OUT_OF_HOURS";

        // 2. Verifica Conflitos de Agenda
        const conflict = await prisma.appointment.findFirst({
            where: {
                doctorId: doctor.id,
                date: date,
                status: { notIn: ["CANCELLED", "NO_SHOW"] }
            }
        });

        if (conflict) return "BUSY";

        return "AVAILABLE";
    };

    // Verifica o horário solicitado
    const availabilityStatus = await isSlotAvailable(appointmentDate);

    if (availabilityStatus !== "AVAILABLE") {
        // Se não está disponível, busca as próximas 3 sugestões
        const suggestions: string[] = [];
        let attemptDate = addMinutes(appointmentDate, APPOINTMENT_DURATION); // Começa logo após
        let attempts = 0;

        while (suggestions.length < 3 && attempts < 50) { // Limite de tentativas para não travar
            const status = await isSlotAvailable(attemptDate);
            if (status === "AVAILABLE") {
                suggestions.push(format(attemptDate, "dd/MM/yyyy HH:mm"));
            }
            attemptDate = addMinutes(attemptDate, APPOINTMENT_DURATION);
            attempts++;
        }

        const message = availabilityStatus === "BUSY" ? "Horário ocupado" : "Fora do expediente";
        
        return NextResponse.json({ 
            error: message, 
            suggestions,
            status: 409 // Conflict
        }, { status: 409 });
    }

    // 6. Cria Agendamento (Se chegou aqui, está livre)
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        status: "CONFIRMED", // Já confirmamos pois validamos disponibilidade
        notes: "Agendado via WhatsApp Bot",
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