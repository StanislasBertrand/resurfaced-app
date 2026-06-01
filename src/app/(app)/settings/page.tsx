import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AnthropicSettings } from "./anthropic-settings";

export default async function SettingsPage() {
  const { workspace } = await getCurrentUser();

  const anthropicSettings = await prisma.anthropicSettings.findUnique({
    where: { workspaceId: workspace.id },
  });

  // If connected, fetch the org name from Anthropic
  let orgName: string | undefined;
  if (anthropicSettings) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/organizations/me", {
        headers: {
          "x-api-key": anthropicSettings.adminApiKey,
          "anthropic-version": "2023-06-01",
        },
      });
      if (res.ok) {
        const data = await res.json();
        orgName = data.name;
      }
    } catch {
      // Key may be invalid now, still show as connected
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Connect your AI providers
      </h1>

      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <li>
          <AnthropicSettings
            isConnected={!!anthropicSettings}
            orgName={orgName}
          />
        </li>
      </ul>
    </div>
  );
}
