import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/api/auth/login',
    error: '/error',
  }
})

export const config = { matcher: ["/", "/claim", "/chat", "/profile"] }