import { Users, Calendar, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns"; 

export default async function DashboardPage() {
  // 1. Buscando dados gerais
  const totalPacientes = await prisma.patient.count();
  const totalConsultas = await prisma.appointment.count();
  
  // 2. Calculando o intervalo de tempo de "HOJE" (00:00 até 23:59)
  const hojeInicio = startOfDay(new Date());
  const hojeFim = endOfDay(new Date());

  // 3. Buscando quantas consultas caem exatamente NESTE intervalo
  const consultasHoje = await prisma.appointment.count({
    where: {
      date: {
        gte: hojeInicio, // Maior ou igual ao inicio do dia
        lte: hojeFim     // Menor ou igual ao fim do dia
      }
    }
  });

  // 4. Buscando os 5 últimos pacientes para a lista
  const ultimosPacientes = await prisma.patient.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
      
      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1: Total de Pacientes */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total de Pacientes</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalPacientes}</div>
            <p className="text-xs text-muted-foreground">Pacientes cadastrados</p>
          </div>
        </div>

        {/* Card 2: Consultas Totais */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Agendamentos</h3>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalConsultas}</div>
            <p className="text-xs text-muted-foreground">Histórico total</p>
          </div>
        </div>

        {/* Card 3: Consultas HOJE (Agora conectado!) */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Consultas Hoje</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            {/* Mostra o número real de hoje */}
            <div className="text-2xl font-bold text-primary">{consultasHoje}</div>
            <p className="text-xs text-muted-foreground">Agendadas para hoje</p>
          </div>
        </div>
      </div>

      {/* Lista de Últimos Pacientes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-1.5">
            <h3 className="font-semibold leading-none tracking-tight">Últimos Pacientes</h3>
            <p className="text-sm text-muted-foreground">
              Os pacientes mais recentes cadastrados no sistema.
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-8">
              
              {ultimosPacientes.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum paciente recente.</p>
              )}

              {ultimosPacientes.map((paciente) => (
                <div key={paciente.id} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {paciente.name.substring(0,2).toUpperCase()}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{paciente.name}</p>
                    <p className="text-sm text-muted-foreground">{paciente.phone}</p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">
                    {new Date(paciente.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}