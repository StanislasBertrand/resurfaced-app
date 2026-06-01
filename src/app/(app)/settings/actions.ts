"use server";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export type SaveKeyResult = {
  success: boolean;
  error?: string;
  orgName?: string;
};

export async function saveAnthropicKey(key: string): Promise<SaveKeyResult> {
  const { workspace } = await getCurrentUser();

  // Validate the key by calling Anthropic's org info endpoint
  const res = await fetch("https://api.anthropic.com/v1/organizations/me", {
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      return { success: false, error: "Invalid API key. Make sure you're using an Admin API key (starts with sk-ant-admin...)." };
    }
    return { success: false, error: `Anthropic API returned ${res.status}. Please try again.` };
  }

  const data = await res.json();

  await prisma.anthropicSettings.upsert({
    where: { workspaceId: workspace.id },
    update: { adminApiKey: key },
    create: { workspaceId: workspace.id, adminApiKey: key },
  });

  return { success: true, orgName: data.name };
}

export async function removeAnthropicKey(): Promise<{ success: boolean }> {
  const { workspace } = await getCurrentUser();

  await prisma.anthropicSettings.deleteMany({
    where: { workspaceId: workspace.id },
  });

  return { success: true };
}
