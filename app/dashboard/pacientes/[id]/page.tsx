import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, User, Trash2, Edit, Clock, Mail, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { saveMedicalRecord, deletePatient } from "@/app/actions/pacientes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PacientePage({ params }: PageProps) {
  const { id } = await params;

  // Busca paciente E seus históricos (records) ordenados do mais recente para o antigo
  const paciente = await prisma.patient.findUnique({
    where: { id },
    include: {
      records: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!paciente) {
    notFound();
  }

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/pacientes" 
          className="p-2 rounded-lg border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{paciente.name}</h2>
          
          {/* Informações do Paciente (CPF, Tel, Email) */}
          <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> CPF: {paciente.cpf}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {paciente.phone}
              </span>
            </div>
            {/* E-mail adicionado aqui */}
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> {paciente.email || "Sem e-mail cadastrado"}
            </span>
          </div>
        </div>
        
        {/* Botões de Ação */}
        <div className="flex gap-2">
            
            {/* Botão EXCLUIR */}
            <form action={deletePatient}>
                <input type="hidden" name="id" value={paciente.id} />
                <button 
                  type="submit" 
                  className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                </button>
            </form>

            {/* Botão NOVA RECEITA */}
            <Link 
                href={`/dashboard/pacientes/${paciente.id}/receita`}
                className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
                <FileText className="h-4 w-4" />
                Receita
            </Link>

            {/* Botão EDITAR */}
            <Link 
                href={`/dashboard/pacientes/${paciente.id}/editar`}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
                <Edit className="h-4 w-4" />
                Editar Dados
            </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Coluna Principal: Evolução e Histórico */}
        <div className="md:col-span-2 space-y-8">
            
            {/* Formulário de Nova Evolução */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 border-b pb-2">
                    <Edit className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Nova Evolução</h3>
                </div>
                
                <form action={saveMedicalRecord}>
                    <input type="hidden" name="patientId" value={paciente.id} />
                    
                    <textarea 
                        name="description"
                        required
                        placeholder="Digite a evolução do paciente, queixas e observações..."
                        className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                    <div className="flex justify-end mt-2">
                        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                            Salvar Evolução
                        </button>
                    </div>
                </form>
            </div>

            {/* Lista de Histórico REAL */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Histórico Clínico
                </h3>
                
                {paciente.records.length === 0 && (
                    <div className="text-center p-12 border rounded-xl border-dashed text-muted-foreground text-sm bg-muted/10">
                        Nenhum registro clínico encontrado para este paciente.
                    </div>
                )}
                
                {paciente.records.map((record) => (
                    <div key={record.id} className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Consulta
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    {new Date(record.createdAt).toLocaleDateString('pt-BR')} às {new Date(record.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {record.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Coluna Lateral: Detalhes Fixo */}
        <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-sm border-b pb-2">Detalhes do Paciente</h3>
                
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Data de Nascimento</p>
                        <p className="font-medium mt-1">
                            {paciente.birthDate ? new Date(paciente.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Convênio</p>
                        <p className="font-medium mt-1">Particular</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Primeira Visita</p>
                        <p className="font-medium mt-1">{new Date(paciente.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}