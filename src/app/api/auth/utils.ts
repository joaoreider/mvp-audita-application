import { db } from "@/db";
import type { User } from "@prisma/client";

export async function findByEmail(email: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}
