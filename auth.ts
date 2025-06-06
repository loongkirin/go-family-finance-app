import NextAuth from "next-auth"
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/account/login",
    error: "/account/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log("linkAccount", user);
    }
  },
  callbacks: {
    // async signIn({ user, account }) {
    //   console.log("signIn", user, account);

    //   return true;
    // },
    async signIn(credentials) {
      console.log("signIn", credentials);

      return true;
    },
    async session({ token, session }) {
      console.log("session-session", session);
      console.log("session-token", token)
      
      return session;
    },
    // async jwt({ token }) {
    //   console.log("jwt", token);
    //   return token;
    // }
    async jwt(credentials) {
      console.log("server--jwt", credentials);
      const token = credentials.token;
      console.log("server-jwt-user", credentials.user)
      const user = credentials.user
      token.name = user?.name
      token.email = user?.email
      return token;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});
