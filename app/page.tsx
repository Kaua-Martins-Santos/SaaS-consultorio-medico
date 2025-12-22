import Link from "next/link";
import { Stethoscope, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Clinique Pro
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse seu consultório digital
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  placeholder="doutor@clinica.com"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <input
                  type="password"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Botão agora leva ao Dashboard */}
              <Link 
                href="/dashboard" 
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Entrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </form>
          </div>
          <div className="flex items-center justify-center border-t p-4 bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Protegido por criptografia de ponta a ponta.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}