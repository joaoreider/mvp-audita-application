import { db } from "@/db";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { findByEmail } from "@/app/api/auth/utils";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

declare module "next-auth" {
  interface User {
    id: number;
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) {
          throw new Error("Email e senha devem ser fornecidos");
        }

        try {
          const user = await findByEmail(email);
          if (!user || !user?.password) {
            throw new Error("Usuário não cadastrado");
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          console.log("isPasswordValid: ", isPasswordValid);
          if (isPasswordValid) {
            const notPassowrdedUser = { ...user, password: undefined };
            return notPassowrdedUser;
          }
          throw new Error("Credenciais inválidas");
        } catch (e: unknown) {
          if (e instanceof Error) {
            throw new Error(e.message);
          }
          throw new Error("Algo deu errado. Tente novamente mais tarde.");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/login",
  },

  // callbacks: {
  //   async jwt({ token, user }: any) {
  //     return await token;
  //   },
  // },
});

export { handler as GET, handler as POST };
