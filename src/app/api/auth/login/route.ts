import { db } from "@/db";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
// Prisma will help handle and catch errors
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findByEmail } from "../register/route";
import { NextResponse } from "next/server";

async function handle(req: Request, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = await req.json();
    // create user
    console.log(
      "[DEBUG] (LOGIN ROUTE) (handle) (req.method === 'POST') (req.body):",
      body
    );
    try {
      const result = await loginUserHandler(body);
      switch (result.status) {
        case 400:
          return NextResponse.json(
            { message: "Email e senha devem ser fornecidos" },
            { status: 400 }
          );
        case 401:
          return NextResponse.json(
            { message: "Credenciais inválidas" },
            { status: 401 }
          );
        case 200:
          return NextResponse.json(result.user);
      }
    } catch (error) {
      console.error(error);
      return NextResponse.error();
    }
  } else {
    return res.status(405).json({ message: "Method Not allowed" });
  }
}

async function loginUserHandler(body: { email: string; password: string }) {
  const { email, password } = body;
  if (!email || !password) {
    return { status: 400 };
  }
  try {
    const user = await findByEmail(email);
    if (!user) {
      return { status: 401 };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { status: 401 };
    }
    const notPassowrdedUser = { ...user, password: undefined };
    return { status: 200, user: notPassowrdedUser };
  } catch (e) {
    throw e;
  }
}

export const POST = handle;
