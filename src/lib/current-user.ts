import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Not authenticated");
  }

  const existing = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      memberships: {
        include: { workspace: true },
      },
    },
  });

  if (existing) {
    return {
      user: existing,
      workspace: existing.memberships[0].workspace,
    };
  }

  // First login — create user + default workspace
  const clerkUser = await currentUser();

  const user = await prisma.user.create({
    data: {
      clerkId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      name: clerkUser?.fullName,
      memberships: {
        create: {
          role: "owner",
          workspace: {
            create: {
              name: "My Workspace",
            },
          },
        },
      },
    },
    include: {
      memberships: {
        include: { workspace: true },
      },
    },
  });

  return {
    user,
    workspace: user.memberships[0].workspace,
  };
});
