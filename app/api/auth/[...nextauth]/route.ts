import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

// Configuración de NextAuth
const handler = NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login", // opcional
  },
});

// Exporta el handler como GET y POST
export { handler as GET, handler as POST };
