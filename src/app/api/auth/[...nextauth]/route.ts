import { db } from "@/db";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { findByEmail } from "../register/route";

import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

declare module "next-auth" {
  interface User {
    id: number; // <- here it is
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
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

          //Finding Password
          if (!user || !user?.password) {
            throw new Error("Invalid Credentials");
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
          }
          const notPassowrdedUser = { ...user, password: undefined };
          return notPassowrdedUser;
        } catch (e) {
          throw e;
        }
      },
      credentials: {},
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, user }: any) {
      if (user !== null) {
        session.user = user;
      }
      return session;
    },

    async jwt({ token, user }: any) {
      return await token;
    },
  },
});

export { handler as GET, handler as POST };
