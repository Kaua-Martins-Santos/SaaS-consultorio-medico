import { Users, Clock, Activity, MoreHorizontal, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      
      {/* Cards de Estatísticas (KPIs) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Pacientes Hoje</h3>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">+2 encaixes</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Próximo</h3>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">14:30</div>
          <p className="text-xs text-muted-foreground">Mariana Souza</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Faturamento</h3>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">R$ 1.850</div>
          <p className="text-xs text-muted-foreground">+15% vs ontem</p>
        </div>
      </div>

      {/* Área Principal */}
      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Lista de Pacientes (4 colunas) */}
        <div className="col-span-4 rounded-xl border bg-card shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold">Agenda do Dia</h3>
            <p className="text-sm text-muted-foreground">Segunda-feira</p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {[
              { time: "09:00", name: "João Silva", type: "Primeira Vez", status: "Finalizado" },
              { time: "10:00", name: "Ana Maria", type: "Rotina", status: "Em Atendimento" },
              { time: "11:00", name: "Pedro Costa", type: "Retorno", status: "Aguardando" },
            ].map((patient, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {patient.time}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.type}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{patient.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Destaque / Próximo (3 colunas) */}
        <div className="col-span-3 space-y-6">
          <div className="rounded-xl border bg-primary text-primary-foreground shadow-lg p-6">
            <h3 className="text-lg font-bold">Em atendimento</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                AM
              </div>
              <div>
                <p className="text-xl font-semibold">Ana Maria</p>
                <p className="text-sm opacity-90">Consulta de Rotina</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-lg bg-white py-2 text-sm font-bold text-primary hover:bg-white/90 transition-colors">
              Abrir Prontuário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}