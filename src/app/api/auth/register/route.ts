import { db } from "@/db";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
// Prisma will help handle and catch errors
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

async function handle(req: Request, res: NextApiResponse) {
  if (req.method === "POST") {
    // extract body from request (await this stream and parse it as json)
    const body = await req.json();
    console.log("[DEBUG] (REGISTER ROUTE) (handle) (req.method === 'POST')");
    try {
      const result = await createUserHandler(body);
      if (result.status === 409) {
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 409 }
        );
      }
      return NextResponse.json({ message: "User created" });
    } catch (error) {
      console.error(error);
      return NextResponse.error();
    }
  } else {
    return res.status(405).json({ message: "Method Not allowed" });
  }
}

// function to create user in our database
async function createUserHandler(body: RegisterBody) {
  const { name, email, password } = body;
  const userExists = await findByEmail(email);
  if (userExists) {
    // conflic exepction
    return { status: 409 };
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });
    return { status: 201 };
  } catch (e) {
    throw e;
  }
}

export async function findByEmail(email: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

export const POST = handle;
