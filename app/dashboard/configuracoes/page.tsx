import { prisma } from "@/lib/prisma";
import { updateSettings } from "@/app/actions/settings";
import { UserCog, Save } from "lucide-react";

export default async function ConfiguracoesPage() {
  // Busca seus dados atuais para preencher o formulário
  const user = await prisma.user.findFirst();

  if (!user) return <div>Erro: Usuário não encontrado.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie seus dados profissionais para impressão.</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form action={updateSettings} className="space-y-4">
          
          <div className="flex items-center gap-2 mb-4 text-primary">
            <UserCog className="h-5 w-5" />
            <h3 className="font-semibold">Dados do Médico</h3>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nome Completo (Como sairá na receita)</label>
            <input 
              name="name" 
              defaultValue={user.name}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Especialidade</label>
                <input 
                name="specialty" 
                placeholder="Ex: Clínico Geral"
                defaultValue={user.specialty || ""}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">CRM / Registro</label>
                <input 
                name="crm" 
                placeholder="Ex: 12345-SP"
                defaultValue={user.crm || ""}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Save className="h-4 w-4" />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}