import { RegisterData } from "@/app/lib/types";
import { db } from "../db";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

// export async function signIn(formData: FormData) {
//   const { username, password } = formData;
//   const user = await findByEmail(username);

//   if (user) {
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (isPasswordValid) {
//       return {
//         ...user,
//         password: undefined,
//       };
//     }
//   }
//   throw new Error("Credenciais inválidas");
// }

async function findByEmail(email: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

export async function createUser(data: RegisterData): Promise<void | string> {
  const userExists = await findByEmail(data.email);
  if (userExists) {
    return "Email já cadastrado";
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
  } catch (error) {
    throw error;
  }
}
