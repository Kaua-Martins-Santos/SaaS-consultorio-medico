import Link from "next/link";
import { LayoutDashboard, Calendar, Users, Settings, User, CircleDollarSign } from "lucide-react";
import { getDoctorSettings } from "@/app/actions/settings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // Buscamos os dados do médico no banco para mostrar no rodapé do menu
  const doctor = await getDoctorSettings();

  return (
    <div className="flex min-h-screen flex-col md:flex-row md:overflow-hidden">
      
      {/* SIDEBAR (Menu Lateral) */}
      <div className="w-full flex-none md:w-64 bg-white border-r">
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
          
          {/* Logo / Título */}
          <Link
            className="mb-2 flex h-20 items-end justify-start rounded-md bg-primary p-4 md:h-20"
            href="/dashboard"
          >
            <div className="w-32 text-white md:w-40">
              <span className="text-xl font-bold">Clinique Pro</span>
            </div>
          </Link>

          {/* Links de Navegação */}
          <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 mt-4">
            
            {/* 1. Visão Geral */}
            <Link
              href="/dashboard"
              className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <LayoutDashboard className="w-6" />
              <p className="hidden md:block">Visão Geral</p>
            </Link>

            {/* 2. Agenda */}
            <Link
              href="/dashboard/agenda"
              className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <Calendar className="w-6" />
              <p className="hidden md:block">Agenda</p>
            </Link>

            {/* 3. Pacientes */}
            <Link
              href="/dashboard/pacientes"
              className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <Users className="w-6" />
              <p className="hidden md:block">Pacientes</p>
            </Link>

            {/* 4. FINANCEIRO (Novo!) */}
            <Link
              href="/dashboard/financeiro"
              className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <CircleDollarSign className="w-6" />
              <p className="hidden md:block">Financeiro</p>
            </Link>
            
            {/* 5. Configurações */}
            <Link
              href="/dashboard/configuracoes"
              className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <Settings className="w-6" />
              <p className="hidden md:block">Configurações</p>
            </Link>

            <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
            
            {/* RODAPÉ DO MÉDICO (Perfil) */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-3 shadow-sm mt-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                   {/* Pega a inicial do nome ou usa 'D' */}
                   <span className="font-bold">{doctor?.name?.charAt(0) || "D"}</span>
                </div>
                <div className="flex-1 overflow-hidden hidden md:block">
                   <p className="truncate text-sm font-bold text-gray-900">
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

      {/* ÁREA PRINCIPAL */}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}