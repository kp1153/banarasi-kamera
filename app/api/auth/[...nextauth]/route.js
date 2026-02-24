import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db, { initDB } from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        mobile: { label: "मोबाइल", type: "text" },
        password: { label: "पासवर्ड", type: "password" },
      },
      async authorize(credentials) {
        await initDB();
        const result = await db.execute({
          sql: "SELECT * FROM activists WHERE mobile = ?",
          args: [credentials.mobile],
        });
        const activist = result.rows[0];
        if (!activist) return null;
        const valid = await bcrypt.compare(credentials.password, activist.password);
        if (!valid) return null;
        return {
          id: activist.id,
          name: activist.name,
          mobile: activist.mobile,
          role: activist.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.mobile = user.mobile;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.mobile = token.mobile;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };