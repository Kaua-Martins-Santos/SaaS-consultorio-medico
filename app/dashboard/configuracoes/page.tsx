import { updateSettings, getDoctorSettings } from "@/app/actions/settings";
import { Save, User, MapPin, Building, Phone, ImageIcon } from "lucide-react"; // Adicionei ImageIcon aqui opcionalmente

export default async function ConfiguracoesPage() {
  const doctor = await getDoctorSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Configurações</h2>
        <p className="text-muted-foreground">Gerencie seus dados pessoais e informações da clínica.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form action={updateSettings} className="space-y-8">
            
            {/* Seção 1: Dados do Médico */}
            <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-primary">
                    <User className="w-5 h-5" /> Dados do Profissional
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                        <input 
                            name="name" 
                            defaultValue={doctor?.name} 
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Especialidade</label>
                        <input 
                            name="specialty" 
                            defaultValue={doctor?.specialty || ""} 
                            placeholder="Ex: Cardiologista"
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">CRM</label>
                        <input 
                            name="crm" 
                            defaultValue={doctor?.crm || ""} 
                            placeholder="Ex: 123456/SP"
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 my-4" />

            {/* Seção 2: Dados da Clínica */}
            <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-primary">
                    <Building className="w-5 h-5" /> Informações da Clínica
                </h3>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nome da Clínica</label>
                        <input 
                            name="clinicName" 
                            defaultValue={doctor?.clinicName || ""} 
                            placeholder="Ex: Virtus Clinical"
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Endereço Completo
                            </label>
                            <input 
                                name="clinicAddress" 
                                defaultValue={doctor?.clinicAddress || ""} 
                                placeholder="Rua, Número - Cidade/UF"
                                className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Telefone Comercial
                            </label>
                            <input 
                                name="clinicPhone" 
                                defaultValue={doctor?.clinicPhone || ""} 
                                placeholder="(00) 0000-0000"
                                className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* --- AQUI ESTÁ A ADIÇÃO Do passo de adição logo --- */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                             URL da Logo (Marca D'água)
                        </label>
                        <input 
                            name="clinicLogo" 
                            // @ts-ignore (Caso o TS reclame antes de você rodar o prisma generate)
                            defaultValue={doctor?.clinicLogo || ""} 
                            placeholder="Ex: https://minhaclinica.com/logo.png"
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        />
                        <p className="text-xs text-gray-500">
                            Cole o link de uma imagem (PNG ou JPG) para aparecer no fundo da receita.
                        </p>
                    </div>
                    {/* -------------------------------------- */}

                </div>
            </div>

            <button 
                type="submit" 
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-primary/90 transition-all ml-auto"
            >
                <Save className="w-4 h-4" /> Salvar Alterações
            </button>
        </form>
      </div>
    </div>
  );
}