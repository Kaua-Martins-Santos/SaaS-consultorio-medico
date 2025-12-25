import { Users, Calendar, Activity, Clock, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns"; 
import Link from "next/link";

export default async function DashboardPage() {
  // 1. Dados estatísticos básicos
  const totalPacientes = await prisma.patient.count();
  const totalConsultas = await prisma.appointment.count();
  
  const hojeInicio = startOfDay(new Date());
  const hojeFim = endOfDay(new Date());

  const consultasHoje = await prisma.appointment.count({
    where: {
      date: { gte: hojeInicio, lte: hojeFim }
    }
  });

  // 2. BUSCA O PRÓXIMO PACIENTE (A GRANDE NOVIDADE)
  // Pega o agendamento que é MAIOR que agora (futuro) mas é o mais próximo (order asc)
  const proximoAtendimento = await prisma.appointment.findFirst({
    where: {
      date: { gte: new Date() }, // Daqui pra frente
      status: { not: "CANCELLED" } // Ignora cancelados se houver
    },
    orderBy: {
      date: 'asc' // O mais perto primeiro
    },
    include: {
      patient: true // Traz os dados do paciente junto
    }
  });

  // 3. Últimos pacientes cadastrados
  const ultimosPacientes = await prisma.patient.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight text-primary">Medflow</h2>
         <p className="text-muted-foreground">Visão geral do dia</p>
      </div>

      {/* --- NOVO: CARD DE DESTAQUE (PRÓXIMO PACIENTE) --- */}
      {proximoAtendimento ? (
        <div className="rounded-xl border bg-gradient-to-r from-primary to-secondary text-white shadow-lg overflow-hidden relative">
          <div className="p-8 relative z-10">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <div className="flex items-center space-x-2 text-primary-foreground/80 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">Próximo Atendimento</span>
                   </div>
                   <h3 className="text-3xl font-bold mb-1">{proximoAtendimento.patient.name}</h3>
                   <p className="text-primary-foreground/90 text-lg">
                      Horário: {proximoAtendimento.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
                
                <Link href={`/dashboard/pacientes/${proximoAtendimento.patientId}`}>
                  <button className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow-sm flex items-center gap-2 transition-all">
                    Iniciar Consulta
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
             </div>
          </div>
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center bg-gray-50">
           <p className="text-muted-foreground">Nenhum atendimento agendado para as próximas horas.</p>
        </div>
      )}

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Pacientes</h3>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalPacientes}</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Consultas (Total)</h3>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalConsultas}</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Consultas Hoje</h3>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-primary">{consultasHoje}</div>
          </div>
        </div>
      </div>

      {/* Lista de Últimos Pacientes */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">Últimos Cadastros</h3>
            <div className="space-y-6">
              {ultimosPacientes.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum paciente recente.</p>
              )}

              {ultimosPacientes.map((paciente) => (
                <div key={paciente.id} className="flex items-center border-b last:border-0 pb-3 last:pb-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {paciente.name.substring(0,2).toUpperCase()}
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{paciente.name}</p>
                    <p className="text-sm text-muted-foreground">{paciente.phone}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(paciente.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}