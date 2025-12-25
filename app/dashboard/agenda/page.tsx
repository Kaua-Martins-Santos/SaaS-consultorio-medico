import Link from "next/link";
import { Plus, Calendar as CalendarIcon, Clock, Check, X, Trash2 } from "lucide-react";
import { getAppointments, updateStatus, deleteAppointment } from "@/app/actions/agenda";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params?.filter || "today"; // Padrão: mostra só HOJE

  const appointments = await getAppointments(filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Agenda</h2>
        
        <div className="flex gap-2">
            {/* Filtros de Data */}
            <Link 
                href="/dashboard/agenda?filter=today"
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === 'today' ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Hoje
            </Link>
            <Link 
                href="/dashboard/agenda?filter=upcoming"
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === 'upcoming' ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Próximos
            </Link>
            <Link 
                href="/dashboard/agenda?filter=all"
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === 'all' ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Todos
            </Link>
        </div>

        <Link
          href="/dashboard/agenda/novo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`rounded-xl border shadow-sm transition-all hover:shadow-md overflow-hidden bg-white
                ${appointment.status === 'CANCELLED' ? 'opacity-60 grayscale' : ''}
            `}
          >
            {/* Cabeçalho do Card */}
            <div className={`px-6 py-3 border-b flex justify-between items-center
                 ${appointment.status === 'PENDING' ? 'bg-yellow-50' : ''}
                 ${appointment.status === 'CONFIRMED' ? 'bg-green-50' : ''}
                 ${appointment.status === 'CANCELLED' ? 'bg-gray-100' : ''}
            `}>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{appointment.date.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                  ${appointment.status === 'PENDING' ? 'text-yellow-700 bg-yellow-100/50' : ''}
                  ${appointment.status === 'CONFIRMED' ? 'text-green-700 bg-green-100/50' : ''}
                  ${appointment.status === 'CANCELLED' ? 'text-gray-600 bg-gray-200' : ''}
                `}>
                  {appointment.status === 'PENDING' && 'Pendente'}
                  {appointment.status === 'CONFIRMED' && 'Confirmado'}
                  {appointment.status === 'CANCELLED' && 'Cancelado'}
                </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{appointment.patient.name}</h3>
                <div className="flex items-center gap-2 text-sm text-primary font-medium mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              
              {appointment.notes && (
                <p className="text-sm text-gray-500 line-clamp-2 bg-gray-50 p-2 rounded-md italic">
                  "{appointment.notes}"
                </p>
              )}

              {/* Botões de Ação */}
              <div className="pt-2 flex gap-2 mt-auto">
                 {/* BOTÃO CONFIRMAR (Só aparece se pendente) */}
                 {appointment.status === 'PENDING' && (
                    <form action={updateStatus} className="flex-1">
                        <input type="hidden" name="id" value={appointment.id} />
                        <input type="hidden" name="status" value="CONFIRMED" />
                        <button className="w-full flex items-center justify-center gap-1 text-xs bg-green-100 hover:bg-green-200 py-2 rounded text-green-800 font-bold transition-colors">
                            <Check className="w-3 h-3" /> Confirmar
                        </button>
                    </form>
                 )}

                 {/* BOTÃO CANCELAR (Se não estiver cancelado) */}
                 {appointment.status !== 'CANCELLED' && (
                    <form action={updateStatus} className="flex-1">
                        <input type="hidden" name="id" value={appointment.id} />
                        <input type="hidden" name="status" value="CANCELLED" />
                        <button className="w-full flex items-center justify-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 py-2 rounded text-gray-700 font-medium transition-colors">
                            <X className="w-3 h-3" /> Cancelar
                        </button>
                    </form>
                 )}

                 {/* BOTÃO EXCLUIR */}
                 <form action={deleteAppointment}>
                    <input type="hidden" name="id" value={appointment.id} />
                    <button className="p-2 bg-white border hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded transition-colors" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                    </button>
                 </form>
              </div>
            </div>
          </div>
        ))}
        
        {appointments.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <CalendarIcon className="w-10 h-10 text-gray-300 mb-2" />
                <p>Nenhum agendamento encontrado para este filtro.</p>
            </div>
        )}
      </div>
    </div>
  );
}