import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
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

        // 3. Verifica a senha com Criptografia (Bcrypt)
        // Se a senha no banco não estiver criptografada ainda (ex: "123"), 
        // essa comparação vai falhar. Você precisará criar um novo usuário ou resetar a senha.
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (isPasswordValid) {
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
            // @ts-ignore
            session.user.id = token.sub
        }
        return session
    }
  }
})

export { handler as GET, handler as POST }