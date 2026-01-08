import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PatientTabs } from "./patient-tabs"
import Link from "next/link"
import { FileText } from "lucide-react"

export default async function PatientDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")
  
  // @ts-ignore
  const tenantId = session.user.tenantId

  const patient = await prisma.patient.findUnique({
    where: { 
      id: params.id,
      tenantId: tenantId
    },
    include: {
      records: {
        orderBy: { createdAt: 'desc' },
        include: {
          attachments: true
        }
      },
      appointments: {
        orderBy: { date: 'desc' },
        take: 5
      }
    }
  })

  if (!patient) {
    return <div className="p-8">Paciente não encontrado ou acesso negado.</div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Cabeçalho com Botão Restaurado */}
      <div className="flex justify-between items-start mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
            <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span>CPF: {patient.cpf || 'Não informado'}</span>
                <span>•</span>
                <span>{patient.phone}</span>
            </div>
        </div>
        
        {/* BOTÃO DE RECEITA VOLTOU AQUI 👇 */}
        <div className="flex gap-3">
             <Link 
                href={`/dashboard/pacientes/${patient.id}/receita`} 
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 hover:text-blue-600 flex items-center gap-2 transition-all"
             >
                 <FileText className="w-4 h-4" /> 
                 <span className="hidden sm:inline">Gerar Receita</span>
             </Link>
        </div>
      </div>

      <PatientTabs patient={patient} />
    </div>
  )
}