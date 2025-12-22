import Link from "next/link";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";

export default function PacientesPage() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">Gerencie seus pacientes e prontuários.</p>
        </div>
        {/* Agora é um Link funcional */}
        <Link 
          href="/dashboard/pacientes/novo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Paciente
        </Link>
      </div>

      {/* Barra de Filtros e Busca */}
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
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Convênio</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Última Consulta</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {/* Mock de Dados - Linha 1 */}
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium">Ana Maria Silva</td>
                <td className="p-4 align-middle text-muted-foreground">123.456.789-00</td>
                <td className="p-4 align-middle">Unimed</td>
                <td className="p-4 align-middle">12/10/2023</td>
                <td className="p-4 align-middle">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Ativo</span>
                </td>
                <td className="p-4 align-middle text-right">
                  <button className="h-8 w-8 p-0 hover:bg-muted rounded-md inline-flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              
              {/* Mock de Dados - Linha 2 */}
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium">Carlos Eduardo</td>
                <td className="p-4 align-middle text-muted-foreground">987.654.321-11</td>
                <td className="p-4 align-middle">Particular</td>
                <td className="p-4 align-middle">10/09/2023</td>
                <td className="p-4 align-middle">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Ativo</span>
                </td>
                <td className="p-4 align-middle text-right">
                  <button className="h-8 w-8 p-0 hover:bg-muted rounded-md inline-flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>

              {/* Mock de Dados - Linha 3 */}
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium">Mariana Souza</td>
                <td className="p-4 align-middle text-muted-foreground">456.123.789-22</td>
                <td className="p-4 align-middle">Bradesco Saúde</td>
                <td className="p-4 align-middle">--</td>
                <td className="p-4 align-middle">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">Novo</span>
                </td>
                <td className="p-4 align-middle text-right">
                  <button className="h-8 w-8 p-0 hover:bg-muted rounded-md inline-flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}