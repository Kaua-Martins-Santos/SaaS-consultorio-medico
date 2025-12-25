import Link from "next/link";
import { Plus, Calendar as CalendarIcon, Clock, User, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AgendaPage() {
  // Busca agendamentos ordenados por data (os mais próximos primeiro)
  // O "include: { patient: true }" traz os dados do paciente junto!
  const agendamentos = await prisma.appointment.findMany({
    orderBy: {
      date: 'asc'
    },
    include: {
      patient: true
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda</h2>
          <p className="text-muted-foreground">Próximas consultas agendadas.</p>
        </div>
        <Link 
          href="/dashboard/agenda/novo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Link>
      </div>

      <div className="grid gap-4">
        {agendamentos.length === 0 && (
          <div className="text-center p-12 border rounded-xl border-dashed text-muted-foreground">
            Nenhuma consulta agendada.
          </div>
        )}

        {agendamentos.map((consulta) => (
          <div key={consulta.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors shadow-sm">
            
            {/* Esquerda: Data e Hora */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <span className="text-xs font-semibold uppercase">
                  {new Date(consulta.date).toLocaleDateString('pt-BR', { month: 'short' })}
                </span>
                <span className="text-xl font-bold">
                  {new Date(consulta.date).getDate()}
                </span>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  {consulta.patient.name}
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(consulta.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {consulta.notes && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full border">
                      {consulta.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direita: Status/Ações */}
            <div className="flex items-center gap-4">
               <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                 {consulta.status === 'PENDING' ? 'Confirmado' : consulta.status}
               </span>
               <Link href={`/dashboard/pacientes/${consulta.patientId}`} className="text-sm text-primary hover:underline">
                  Ver Prontuário
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}   