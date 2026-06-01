"use server";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function updateProfile(firstName: string, lastName: string) {
  const { user } = await getCurrentUser();

  await prisma.user.update({
    where: { id: user.id },
    data: { firstName, lastName },
  });

  return { success: true };
}
