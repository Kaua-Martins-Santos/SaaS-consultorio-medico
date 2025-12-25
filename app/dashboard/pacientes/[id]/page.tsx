import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Edit, FileText, Calendar, User, Phone, Mail, Clock } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PacienteDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const paciente = await prisma.patient.findUnique({
    where: { id },
    include: {
        appointments: { orderBy: { date: 'desc' } },
        records: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!paciente) return notFound();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-4">
            <Link href="/dashboard/pacientes" className="p-2 hover:bg-gray-100 rounded-full transition-colors border shadow-sm">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{paciente.name}</h1>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        CPF: {paciente.cpf || "N/I"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Nasc: {paciente.birthDate ? new Date(paciente.birthDate).toLocaleDateString('pt-BR') : "N/I"}
                    </span>
                </div>
            </div>
         </div>
         
         <div className="flex gap-3">
             <Link href={`/dashboard/pacientes/${paciente.id}/receita`} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 hover:text-primary flex items-center gap-2 transition-all">
                 <FileText className="w-4 h-4" /> 
                 <span className="hidden sm:inline">Gerar Receita</span>
             </Link>
             <Link href={`/dashboard/pacientes/${paciente.id}/editar`} className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-primary/90 flex items-center gap-2 transition-all">
                 <Edit className="w-4 h-4" /> 
                 <span>Editar</span>
             </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Informações (Agora minimalista) */}
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-6 pb-2 border-b flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Dados de Contato
                  </h3>
                  <div className="space-y-6">
                      <div className="flex items-start gap-4">
                          <div className="mt-1">
                              <Phone className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Telefone</p>
                              <p className="text-base font-medium text-gray-900 mt-0.5">{paciente.phone}</p>
                          </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                          <div className="mt-1">
                              <Mail className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Email</p>
                              <p className="text-base font-medium text-gray-900 mt-0.5">{paciente.email || "—"}</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-4">
                          <div className="mt-1">
                              <Calendar className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Data de Cadastro</p>
                              <p className="text-base font-medium text-gray-900 mt-0.5">
                                  {new Date(paciente.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Coluna Direita: Histórico */}
          <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Histórico Clínico
              </h3>

              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-8">
                  {paciente.appointments.length === 0 && (
                      <div className="ml-8 p-6 bg-gray-50 rounded-lg border border-dashed text-center">
                          <p className="text-gray-500">Nenhum atendimento registrado.</p>
                      </div>
                  )}

                  {paciente.appointments.map((consulta) => (
                      <div key={consulta.id} className="ml-6 relative group">
                          <div className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10
                             ${consulta.status === 'CONFIRMED' ? 'bg-primary' : 
                               consulta.status === 'CANCELLED' ? 'bg-red-400' : 'bg-gray-300'}
                          `}></div>
                          
                          <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <p className="font-bold text-gray-900 text-lg">
                                          {new Date(consulta.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                      </p>
                                      <p className="text-sm text-gray-500 font-medium">
                                          {new Date(consulta.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                  </div>
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full 
                                      ${consulta.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : ''}
                                      ${consulta.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                                      ${consulta.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                                  `}>
                                      {consulta.status === 'PENDING' && 'Agendado'}
                                      {consulta.status === 'CONFIRMED' && 'Realizado'}
                                      {consulta.status === 'CANCELLED' && 'Cancelado'}
                                  </span>
                              </div>
                              
                              {consulta.notes ? (
                                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm border-l-4 border-gray-300">
                                      {consulta.notes}
                                  </div>
                              ) : (
                                  <p className="text-gray-400 text-sm italic">Sem anotações.</p>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}