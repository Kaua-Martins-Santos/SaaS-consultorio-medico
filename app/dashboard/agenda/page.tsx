import Link from "next/link";
import { Plus, Calendar as CalendarIcon, Clock, Check, X, Trash2, DollarSign } from "lucide-react";
import { getAppointments, deleteAppointment } from "@/app/actions/agenda";
// Importamos o novo componente modal
import { EditAppointmentDialog } from "./edit-dialog";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params?.filter || "today"; 

  const appointments = await getAppointments(filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Agenda</h2>
        
        <div className="flex gap-2">
            {/* Filtros de Data */}
            <Link 
                href="/dashboard/agenda?filter=today"
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === 'today' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Hoje
            </Link>
            <Link 
                href="/dashboard/agenda?filter=upcoming"
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === 'upcoming' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Próximos
            </Link>
            <Link 
                href="/dashboard/agenda?filter=all"
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                Todos
            </Link>
        </div>

        <Link href="/dashboard/agenda/novo" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Novo Agendamento
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            
            {/* CABEÇALHO DO CARD */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{appointment.patient.name}</h3>
                    <p className="text-sm text-gray-500">{appointment.service?.name || "Consulta Geral"}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold 
                    ${appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                      appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'}`}>
                    {appointment.status === 'PENDING' && 'Pendente'}
                    {appointment.status === 'CONFIRMED' && 'Confirmado'}
                    {appointment.status === 'COMPLETED' && 'Concluído'}
                    {appointment.status === 'CANCELLED' && 'Cancelado'}
                </span>
            </div>
            
            {/* INFORMAÇÕES */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                    {new Date(appointment.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">
                      {appointment.price > 0 ? `R$ ${appointment.price.toFixed(2)}` : 'A definir'}
                    </span>
                </div>
            </div>

            {/* AÇÕES */}
            <div className="pt-4 border-t mt-2">
              <div className="flex items-center gap-2">
                 
                 {/* AQUI ESTÁ A NOVIDADE: O BOTÃO DE EDITAR/FINALIZAR */}
                 <div className="flex-1">
                    <EditAppointmentDialog appointment={appointment} />
                 </div>

                 {/* BOTÃO EXCLUIR (Discreto) */}
                 <form action={deleteAppointment}>
                    <input type="hidden" name="id" value={appointment.id} />
                    <button className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors" title="Excluir">
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