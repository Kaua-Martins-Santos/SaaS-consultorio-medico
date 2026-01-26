import { getDoctorSettings, updateSettings } from "@/app/actions/settings";
import { Save, Building2, User, MapPin, Clock } from "lucide-react";

const DIAS_SEMANA = [
    { id: 0, label: "Domingo" },
    { id: 1, label: "Segunda-feira" },
    { id: 2, label: "Terça-feira" },
    { id: 3, label: "Quarta-feira" },
    { id: 4, label: "Quinta-feira" },
    { id: 5, label: "Sexta-feira" },
    { id: 6, label: "Sábado" },
];

export default async function SettingsPage() {
  const doctor = await getDoctorSettings();

  if (!doctor) return <div>Erro ao carregar configurações. Faça login novamente.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Configurações</h2>
        <p className="text-gray-500">Gerencie seu perfil, clínica e horários de atendimento.</p>
      </div>

      <form action={updateSettings} className="space-y-8">
        
        {/* SEÇÃO 1: DADOS DO MÉDICO */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700 border-b pb-2">
                <User className="w-5 h-5 text-blue-500" /> 
                Dados do Profissional
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input 
                        name="name" 
                        defaultValue={doctor.name} 
                        className="w-full border rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                    <input 
                        name="specialty" 
                        defaultValue={doctor.specialty || ""} 
                        placeholder="Ex: Cardiologista"
                        className="w-full border rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CRM / Registro</label>
                    <input 
                        name="crm" 
                        defaultValue={doctor.crm || ""} 
                        placeholder="00000-UF"
                        className="w-full border rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>
        </div>

        {/* SEÇÃO 2: DADOS DA CLÍNICA */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                    <Building2 className="w-5 h-5 text-blue-500" /> 
                    Dados da Clínica
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Clínica</label>
                    <input 
                        name="clinicName" 
                        defaultValue={doctor.tenant?.name || ""} 
                        placeholder="Nome fantasia da clínica"
                        className="w-full border rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                    <input 
                        name="clinicPhone" 
                        defaultValue={doctor.tenant?.whatsappPhone || ""} 
                        placeholder="(00) 00000-0000"
                        className="w-full border rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input 
                        name="clinicLogo" 
                        defaultValue={doctor.tenant?.logoUrl || ""} 
                        placeholder="https://..."
                        className="w-full border rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Endereço Completo
                    </label>
                    <input 
                        name="clinicAddress"
                        defaultValue={doctor.tenant?.address || ""}
                        placeholder="Rua, Número, Bairro, Cidade - UF"
                        className="w-full border rounded-lg p-2.5 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>
        </div>

        {/* SEÇÃO 3: HORÁRIOS DE ATENDIMENTO (NOVA) */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700 border-b pb-2">
                <Clock className="w-5 h-5 text-blue-500" /> 
                Horários de Atendimento
            </h3>
            
            <div className="space-y-4">
                {DIAS_SEMANA.map((dia) => {
                    // Verifica se já existe horário salvo para este dia
                    const availability = doctor.availabilities.find(a => a.dayOfWeek === dia.id);
                    const isActive = !!availability;

                    return (
                        <div key={dia.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                            <div className="w-40 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    name={`day_${dia.id}_active`} 
                                    defaultChecked={isActive}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="font-medium text-gray-700">{dia.label}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <input 
                                    type="time" 
                                    name={`day_${dia.id}_start`}
                                    defaultValue={availability?.startTime || "09:00"}
                                    className="border rounded px-2 py-1 text-gray-600"
                                />
                                <span className="text-gray-400">até</span>
                                <input 
                                    type="time" 
                                    name={`day_${dia.id}_end`}
                                    defaultValue={availability?.endTime || "18:00"}
                                    className="border rounded px-2 py-1 text-gray-600"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-sm text-gray-500 mt-2">
                * Marque a caixa ao lado do dia para ativar o atendimento. O Bot do WhatsApp usará estes horários.
            </p>
        </div>

        <div className="flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2">
                <Save className="w-5 h-5" />
                Salvar Todas Alterações
            </button>
        </div>
      </form>
    </div>
  );
}