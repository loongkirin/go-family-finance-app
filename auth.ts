import NextAuth from "next-auth"
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log("linkAccount", user);
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("signIn", user, account);

      return true;
    },
    async session({ token, session }) {
      console.log("session", token, session);
      return session;
    },
    async jwt({ token }) {
      console.log("jwt", token);
      return token;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});
