import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createAppointment } from "@/app/actions/agenda";

export default async function NovoAgendamentoPage() {
  const pacientes = await prisma.patient.findMany({
    orderBy: { name: 'asc' }
  });

  // Calcula a data/hora mínima para o input (formato YYYY-MM-DDTHH:mm)
  // O new Date() pega a hora atual. O slice corta os segundos para caber no input.
  // Nota: Em produção, idealmente ajustamos o fuso horário, mas localmente isso funciona bem.
  const dataMinima = new Date().toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/agenda" 
          className="p-2 rounded-lg border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Novo Agendamento</h2>
          <p className="text-muted-foreground">Marque uma consulta para um paciente.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form action={createAppointment} className="space-y-6">
          
          {/* Seleção de Paciente */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Paciente
            </label>
            <select 
              name="patientId" 
              required
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Selecione um paciente...</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (CPF: {p.cpf})
                </option>
              ))}
            </select>
          </div>

          {/* Data e Hora com TRAVA visual (min) */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Data e Hora
            </label>
            <input 
              type="datetime-local"
              name="date"
              required
              min={dataMinima} // <--- AQUI ESTÁ A MÁGICA
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="text-[10px] text-muted-foreground">
                * Não é possível agendar datas passadas.
            </p>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações (Opcional)</label>
            <textarea 
              name="notes"
              placeholder="Ex: Primeira consulta, retorno, queixa de dor..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Agendar Consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}