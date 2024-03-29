import { RegisterData } from "@/app/lib/types";
import { db } from "../db";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { ActionReturn } from "./types";

export async function authenticate(
  email: string,
  password: string
): Promise<ActionReturn> {
  const user = await findByEmail(email);
  if (user) {
    if (user.isActive) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        error: "Seu cadastro não está ativo",
      };
    }
  } else {
    return {
      error: "Usuário não cadastrado",
    };
  }
  return {
    error: "Email ou senha inválidos",
  };
}

async function findByEmail(email: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

export async function createUser(data: RegisterData): Promise<ActionReturn> {
  const userExists = await findByEmail(data.email);
  if (userExists) {
    return {
      error: "Usuário já cadastrado",
    };
  }

  const { password, ...userData } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: "user",
      },
    });
    return {};
  } catch (error) {
    console.log("Error on createUser", error);
    return {
      error: "Erro interno do sistema",
    };
  }
}
