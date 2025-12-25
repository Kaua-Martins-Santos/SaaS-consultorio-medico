import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  pages: {
    signIn: "/login", // Página customizada que vamos criar
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 1. Busca o usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // 2. Verifica se existe
        if (!user) {
          return null
        }

        // 3. Verifica a senha 
        // (Nota: Em produção usaríamos bcrypt para comparar hash, 
        // mas como seu usuário teste é "123", vamos comparar direto por enquanto)
        if (user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
        if (session.user && token.sub) {
            // Adiciona o ID do usuário na sessão para usarmos depois
            // @ts-ignore
            session.user.id = token.sub
        }
        return session
    }
  }
})

export { handler as GET, handler as POST }