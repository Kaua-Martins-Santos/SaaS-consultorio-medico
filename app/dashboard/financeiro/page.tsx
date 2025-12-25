import { prisma } from "@/lib/prisma";
import { DollarSign, TrendingUp, Calendar, User } from "lucide-react";

export default async function FinanceiroPage() {
  // 1. Soma Total (Faturamento)
  const faturamento = await prisma.appointment.aggregate({
    _sum: { price: true }
  });
  const total = Number(faturamento._sum.price || 0);

  // 2. Busca o histórico de consultas (apenas as que têm valor > 0)
  const consultasPagas = await prisma.appointment.findMany({
    where: {
      price: { gt: 0 } // Apenas onde o preço é maior que 0
    },
    include: {
      patient: true // Traz o nome do paciente
    },
    orderBy: {
      date: 'desc' // Mais recentes primeiro
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Financeiro</h2>
        <p className="text-muted-foreground">Gestão de faturamento e receitas.</p>
      </div>

      {/* Card de Destaque (O Valor Total) */}
      <div className="rounded-xl border bg-green-50/50 border-green-100 p-8 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <DollarSign className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-green-600">Faturamento Total</p>
                <h3 className="text-3xl font-bold text-green-700">
                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </h3>
            </div>
        </div>
      </div>

      {/* Tabela de Detalhes */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Histórico de Receitas
            </h3>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Paciente</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Serviço/Obs</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Valor</th>
              </tr>
            </thead>
            <tbody>
              {consultasPagas.length === 0 && (
                 <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        Nenhuma receita registrada ainda.
                    </td>
                 </tr>
              )}

              {consultasPagas.map((item) => (
                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="p-4 align-middle font-medium">
                    <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {item.patient.name}
                    </div>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {item.notes || "Consulta de Rotina"}
                  </td>
                  <td className="p-4 align-middle text-right font-medium text-green-600">
                    + {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price))}
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