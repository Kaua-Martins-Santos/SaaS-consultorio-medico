import Link from "next/link";
import { LayoutDashboard, Calendar, Users, Settings, CircleDollarSign } from "lucide-react";
import { getDoctorSettings } from "@/app/actions/settings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const doctor = await getDoctorSettings();

  return (
    <div className="flex min-h-screen flex-col md:flex-row md:overflow-hidden bg-gray-50">
      
      {/* SIDEBAR */}
      <div className="w-full flex-none md:w-64 bg-white border-r border-gray-200">
        <div className="flex h-full flex-col px-3 py-4 md:px-4">
          
          {/* LOGO CORPORATIVO */}
          <Link
            className="mb-6 flex h-16 items-center justify-start rounded-lg bg-primary px-4 shadow-sm"
            href="/dashboard"
          >
            <div className="text-white">
              <p className="text-lg font-bold tracking-tight">VIRTUS</p>
              {/* AQUI MUDOU: De "Clinical Systems" para "Sistema Clínico" */}
              <p className="text-[10px] font-light uppercase tracking-widest opacity-80">Sistema Clínico</p>
            </div>
          </Link>

          {/* Links de Navegação */}
          <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-1">
            
            <Link
              href="/dashboard"
              className="flex h-[40px] grow items-center justify-center gap-3 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary md:flex-none md:justify-start md:px-3"
            >
              <LayoutDashboard className="w-5 h-5" />
              <p className="hidden md:block">Visão Geral</p>
            </Link>

            <Link
              href="/dashboard/agenda"
              className="flex h-[40px] grow items-center justify-center gap-3 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary md:flex-none md:justify-start md:px-3"
            >
              <Calendar className="w-5 h-5" />
              <p className="hidden md:block">Agenda</p>
            </Link>

            <Link
              href="/dashboard/pacientes"
              className="flex h-[40px] grow items-center justify-center gap-3 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary md:flex-none md:justify-start md:px-3"
            >
              <Users className="w-5 h-5" />
              <p className="hidden md:block">Pacientes</p>
            </Link>

            <Link
              href="/dashboard/financeiro"
              className="flex h-[40px] grow items-center justify-center gap-3 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary md:flex-none md:justify-start md:px-3"
            >
              <CircleDollarSign className="w-5 h-5" />
              <p className="hidden md:block">Financeiro</p>
            </Link>
            
            <Link
              href="/dashboard/configuracoes"
              className="flex h-[40px] grow items-center justify-center gap-3 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary md:flex-none md:justify-start md:px-3"
            >
              <Settings className="w-5 h-5" />
              <p className="hidden md:block">Configurações</p>
            </Link>

            <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
            
            {/* RODAPÉ DO MÉDICO */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 mt-auto">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-200 text-gray-600 font-bold border border-gray-300">
                   {doctor?.name?.charAt(0) || "D"}
                </div>
                <div className="flex-1 overflow-hidden hidden md:block">
                   <p className="truncate text-sm font-bold text-gray-800">
                     {doctor?.name || "Dr. Admin"}
                   </p>
                   <p className="truncate text-xs text-gray-500">
                     {doctor?.specialty || "Médico"}
                   </p>
                </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}