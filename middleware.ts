// Esse comando mágico ativa a proteção padrão do NextAuth
export { default } from "next-auth/middleware"

// Aqui configuramos QUAIS rotas precisam de proteção
export const config = {
  // Protege tudo que estiver dentro de /dashboard
  matcher: ["/dashboard/:path*"]
}