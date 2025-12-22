import Link from "next/link";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Stethoscope
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      {/* Sidebar (Barra Lateral) */}
      <aside className="hidden w-64 flex-col border-r bg-card text-card-foreground md:flex shadow-sm z-10">
        
        {/* Logo da Clínica */}
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2 font-bold text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span>Clinique Pro</span>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 space-y-1 p-4">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Visão Geral
          </Link>

          <Link 
            href="/dashboard/agenda" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            Agenda
          </Link>

          <Link 
            href="/dashboard/pacientes" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Users className="h-4 w-4" />
            Pacientes
          </Link>

          <div className="pt-4 mt-4 border-t border-border">
            <Link 
              href="/dashboard/configuracoes" 
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
           </div>
        </nav>

        {/* Rodapé da Sidebar (Perfil) */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              DR
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Dr. André</span>
              <span className="text-xs text-muted-foreground">Médico Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">Visão Geral</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Hoje, 12 Outubro</span>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}