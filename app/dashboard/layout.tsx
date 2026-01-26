import Link from "next/link";
import { LayoutDashboard, Calendar, Users, Settings, CircleDollarSign, LogOut, ChevronRight } from "lucide-react";
import { getDoctorSettings } from "@/app/actions/settings";
import { cn } from "@/lib/utils";

// Componente auxiliar para Links da Sidebar (melhora a leitura do código)
// Em um cenário real, isso poderia ser um arquivo separado.
const SidebarLink = ({ href, icon: Icon, label, isActive }: any) => {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        // Lógica de Ativo vs Inativo
        // Nota: A detecção real de 'active' deve ser feita via usePathname() num client component ou passada via props.
        // Como este é um server component, assumiremos o estilo base, mas recomendo transformar a Sidebar em Client Component para highlight automático.
        "text-gray-600 hover:text-primary hover:bg-primary/5"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-colors", "group-hover:text-primary")} />
      <span>{label}</span>
      {/* Pequeno indicador de hover */}
      <ChevronRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary/50" />
    </Link>
  );
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const doctor = await getDoctorSettings();

  return (
    <div className="flex min-h-screen bg-gray-50/50"> 
      
      {/* SIDEBAR FLUTUANTE (Estilo Moderno) */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-[2px_0_20px_-10px_rgba(0,0,0,0.05)]">
          
          {/* Header da Sidebar */}
          <div className="h-20 flex items-center px-6 border-b border-gray-50">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-glow">
                V
              </div>
              <div>
                <span className="block text-sm font-bold text-gray-900 tracking-tight">VIRTUS</span>
                <span className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest">Clinical</span>
              </div>
            </Link>
          </div>

          {/* Navegação */}
          <div className="flex-1 flex flex-col gap-1 px-4 py-6 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Gestão
            </div>
            
            <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Visão Geral" />
            <SidebarLink href="/dashboard/agenda" icon={Calendar} label="Agenda" />
            <SidebarLink href="/dashboard/pacientes" icon={Users} label="Pacientes" />
            
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-6">
              Administrativo
            </div>
            <SidebarLink href="/dashboard/financeiro" icon={CircleDollarSign} label="Financeiro" />
            <SidebarLink href="/dashboard/configuracoes" icon={Settings} label="Configurações" />
          </div>

          {/* User Profile - Estilo Cartão */}
          <div className="p-4 border-t border-gray-50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
               <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/10 group-hover:scale-105 transition-transform">
                  {doctor?.name?.charAt(0) || "D"}
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {doctor?.name || "Dr. Admin"}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {doctor?.specialty || "Médico Titular"}
                  </p>
               </div>
               <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Topbar Mobile (se necessário) ou apenas área de conteúdo */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in-up">
           {/* Inserir aqui Breadcrumbs ou Header da Página se desejar */}
           {children}
        </div>
      </main>
    </div>
  );
}