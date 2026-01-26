import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  // Protege tudo que estiver dentro de /dashboard
  matcher: ["/dashboard/:path*"],
}