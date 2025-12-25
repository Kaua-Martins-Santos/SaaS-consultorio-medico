import Link from "next/link";
import { Plus, FileText, Trash2 } from "lucide-react";
import { getPatients, deletePatient } from "@/app/actions/pacientes";
import Search from "@/app/components/search"; // Importe o componente que criamos

export default async function PacientesPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>; // Next.js 15: searchParams é Promise
}) {
  // 1. Pega o termo de busca da URL
  const params = await searchParams;
  const query = params?.query || "";
  
  // 2. Busca os dados filtrados
  const pacientes = await getPatients(query);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Pacientes</h2>
        <Link
          href="/dashboard/pacientes/novo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo Paciente
        </Link>
      </div>

      {/* Barra de Busca Funcional */}
      <div className="max-w-md">
         <Search placeholder="Buscar por nome ou CPF..." />
      </div>

      {/* Tabela de Pacientes */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">CPF</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Telefone</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pacientes.map((paciente) => (
                <tr key={paciente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{paciente.name}</td>
                  <td className="p-4 text-gray-600">{paciente.cpf}</td>
                  <td className="p-4 text-gray-600">{paciente.phone}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Botão Ver Prontuário */}
                      <Link 
                        href={`/dashboard/pacientes/${paciente.id}`}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                        title="Abrir Prontuário"
                      >
                         <FileText className="h-4 w-4" />
                      </Link>

                      {/* Botão Excluir (Formulário Server Action) */}
                      <form action={deletePatient}>
                          <input type="hidden" name="id" value={paciente.id} />
                          <button 
                            type="submit"
                            className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                            title="Excluir Paciente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {pacientes.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                        Nenhum paciente encontrado para "{query}".
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}