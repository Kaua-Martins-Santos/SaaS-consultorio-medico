"use client"

import { useState, use, useEffect } from "react"; // <--- TEM QUE TER O 'use'
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { getDoctorSettings } from "@/app/actions/settings";

// A tipagem mudou para Promise
export default function ReceitaPage({ params }: { params: Promise<{ id: string }> }) {
  
  // O 'use' desembrulha a promessa e pega o ID
  const { id } = use(params); 

  const [texto, setTexto] = useState("");
  const [doctor, setDoctor] = useState({
    name: "Carregando...",
    specialty: "",
    crm: ""
  });

  useEffect(() => {
    getDoctorSettings().then((data) => {
        if (data) {
            setDoctor({
                name: data.name,
                specialty: data.specialty || "Clínico Geral",
                crm: data.crm || ""
            })
        }
    })
  }, []);

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 print:py-0 print:bg-white">
      
      <div className="w-full max-w-[210mm] flex items-center justify-between mb-6 print:hidden px-4">
        {/* Aqui usamos o 'id' que veio do use() */}
        <Link 
          href={`/dashboard/pacientes/${id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Prontuário
        </Link>
        <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Imprimir Receita
            </button>
        </div>
      </div>

      <div className="bg-white shadow-xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-[20mm] relative print:w-full print:absolute print:top-0 print:left-0">
        
        <header className="border-b-2 border-gray-100 pb-8 mb-8 flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                <p className="text-sm text-gray-500">{doctor.specialty} • CRM {doctor.crm}</p>
                <p className="text-xs text-gray-400 mt-1">Rua das Flores, 123 - Centro, São Paulo</p>
            </div>
            <div className="text-right">
                <h2 className="text-xl font-bold text-primary/80">RECEITA MÉDICA</h2>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
        </header>

        <main className="min-h-[500px]">
            <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Digite a prescrição médica aqui..."
                className="w-full h-full min-h-[500px] resize-none border-none focus:ring-0 p-0 text-lg leading-relaxed text-gray-800 placeholder:text-gray-300 print:placeholder:hidden bg-transparent"
                spellCheck={false}
            />
        </main>

        <footer className="absolute bottom-[20mm] left-[20mm] right-[20mm] border-t pt-4 text-center">
            <p className="text-xs text-gray-400">
                Este documento não é válido sem assinatura e carimbo do médico.
            </p>
        </footer>

      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; }
          body > *:not(.print:block) { display: none; }
          .min-h-screen { display: block !important; height: auto !important; overflow: visible !important; }
        }
      `}</style>
    </div>
  );
}