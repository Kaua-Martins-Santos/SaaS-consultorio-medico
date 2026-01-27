import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { parseISO, isValid, addMinutes, isBefore, setHours, setMinutes, getDay, format } from "date-fns"

const API_SECRET = "minha-senha-secreta-123"
const APPOINTMENT_DURATION = 30; 

// --- NOVO: Função para buscar dados da clínica (Endereço, Nome, etc) ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")
  const tenantId = searchParams.get("tenantId")

  // 1. Segurança
  if (secret !== API_SECRET) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
  }

  if (!tenantId) {
    return NextResponse.json({ error: "Tenant ID faltando" }, { status: 400 })
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { 
        name: true, 
        address: true,
        whatsappPhone: true 
      }
    })

    if (!tenant) return NextResponse.json({ error: "Clínica não encontrada" }, { status: 404 })

    return NextResponse.json({
      name: tenant.name,
      address: tenant.address || "Endereço não cadastrado no sistema.",
      phone: tenant.whatsappPhone
    })

  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// --- MANTIDO: Função de criar agendamento (POST) ---
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { secret, name, phone, dateIso, tenantId, serviceCategory } = body

    if (secret !== API_SECRET) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
    }

    if (!tenantId || !phone || !dateIso) {
      return NextResponse.json({ error: "Dados faltando" }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\D/g, "")
    let patient = await prisma.patient.findFirst({
      where: { phone: { contains: cleanPhone }, tenantId }
    })

    if (!patient) {
      patient = await prisma.patient.create({
        data: { name, phone: cleanPhone, tenantId }
      })
    }

    const appointmentDate = parseISO(dateIso)
    if (!isValid(appointmentDate)) {
      return NextResponse.json({ error: "Data inválida" }, { status: 400 })
    }

    if (isBefore(appointmentDate, new Date())) {
        return NextResponse.json({ error: "Data no passado" }, { status: 400 })
    }

    const doctor = await prisma.user.findFirst({
      where: { 
        tenantId,
        OR: [{ role: "DOCTOR" }, { role: "OWNER" }]
      },
      include: { availabilities: true }
    })

    if (!doctor) {
      return NextResponse.json({ error: "Sem médico disponível" }, { status: 404 })
    }

    // Busca o Serviço e Preço
    let selectedService = null;
    let appointmentPrice = 0;

    if (serviceCategory) {
        const keyword = serviceCategory === 'RETORNO' ? 'Retorno' : 'Consulta';
        selectedService = await prisma.service.findFirst({
            where: {
                tenantId: tenantId,
                name: { contains: keyword, mode: 'insensitive' },
                active: true
            }
        });

        if (selectedService) {
            appointmentPrice = Number(selectedService.price);
        }
    }

    const isSlotAvailable = async (date: Date) => {
        let isWorkingHours = false;
        
        if (doctor.availabilities.length > 0) {
            const dayOfWeek = getDay(date);
            const availability = doctor.availabilities.find(a => a.dayOfWeek === dayOfWeek);
            
            if (availability) {
                const [startHour, startMin] = availability.startTime.split(':').map(Number);
                const [endHour, endMin] = availability.endTime.split(':').map(Number);
                const startWork = setMinutes(setHours(date, startHour), startMin);
                const endWork = setMinutes(setHours(date, endHour), endMin);
                if (date >= startWork && date < endWork) isWorkingHours = true;
            }
        } else {
            const day = getDay(date);
            const hour = date.getHours();
            if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) isWorkingHours = true;
        }

        if (!isWorkingHours) return "OUT_OF_HOURS";

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

    const availabilityStatus = await isSlotAvailable(appointmentDate);

    if (availabilityStatus !== "AVAILABLE") {
        const suggestions: string[] = [];
        let attemptDate = addMinutes(appointmentDate, APPOINTMENT_DURATION);
        let attempts = 0;

        while (suggestions.length < 3 && attempts < 50) { 
            const status = await isSlotAvailable(attemptDate);
            if (status === "AVAILABLE") {
                suggestions.push(format(attemptDate, "dd/MM/yyyy HH:mm"));
            }
            attemptDate = addMinutes(attemptDate, APPOINTMENT_DURATION);
            attempts++;
        }

        return NextResponse.json({ 
            error: availabilityStatus === "BUSY" ? "Horário ocupado" : "Fora do expediente", 
            suggestions,
            status: 409
        }, { status: 409 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        status: "CONFIRMED",
        notes: "Agendado via WhatsApp Bot",
        patientId: patient.id,
        doctorId: doctor.id,
        tenantId,
        serviceId: selectedService?.id || null, 
        price: appointmentPrice 
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: appointment.id, 
      doctor: doctor.name,
      serviceName: selectedService?.name || "Consulta Padrão",
      price: appointmentPrice 
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}