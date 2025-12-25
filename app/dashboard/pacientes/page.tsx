import Link from "next/link";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma"; // Importamos nossa conexão com o banco

// Transformamos a página em async para poder buscar dados do banco
export default async function PacientesPage() {
  
  // Busca os pacientes no banco de dados (ordenados por data de criação)
  const pacientes = await prisma.patient.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">Gerencie seus pacientes e prontuários.</p>
        </div>
        <Link 
          href="/dashboard/pacientes/novo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Paciente
        </Link>
      </div>

      {/* Barra de Busca */}
      <div className="flex items-center gap-2 rounded-lg border bg-card p-2 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Buscar por nome, CPF ou telefone..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <button className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
          <Filter className="h-4 w-4" />
          Filtros
        </button>
      </div>

      {/* Tabela de Pacientes */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CPF</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Telefone</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data Cadastro</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              
              {/* Se não tiver pacientes, mostra aviso amigável */}
              {pacientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhum paciente encontrado. Clique em "Novo Paciente" para começar.
                  </td>
                </tr>
              )}

              {/* Loop para mostrar os pacientes reais */}
              {pacientes.map((paciente) => (
                <tr key={paciente.id} className="border-b transition-colors hover:bg-muted/50">
                  {/* Célula do Nome agora é um LINK clicável */}
                  <td className="p-4 align-middle font-medium">
                    <Link 
                      href={`/dashboard/pacientes/${paciente.id}`} 
                      className="hover:underline hover:text-primary transition-colors cursor-pointer"
                    >
                      {paciente.name}
                    </Link>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">{paciente.cpf}</td>
                  <td className="p-4 align-middle">{paciente.phone}</td>
                  <td className="p-4 align-middle">
                    {new Date(paciente.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button className="h-8 w-8 p-0 hover:bg-muted rounded-md inline-flex items-center justify-center">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}