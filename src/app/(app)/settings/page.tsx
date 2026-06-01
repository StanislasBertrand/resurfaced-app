import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AnthropicSettings } from "./anthropic-settings";
import { OpenAISettings } from "./openai-settings";

export default async function SettingsPage() {
  const { workspace } = await getCurrentUser();

  const [anthropicSettings, openaiSettings] = await Promise.all([
    prisma.anthropicSettings.findUnique({
      where: { workspaceId: workspace.id },
    }),
    prisma.openAISettings.findUnique({
      where: { workspaceId: workspace.id },
    }),
  ]);

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
    <div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Connect your AI providers
        </h1>
        <p className="text-sm text-muted-foreground">
          {[anthropicSettings, openaiSettings].filter(Boolean).length} of 2 integrations connected
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnthropicSettings
          isConnected={!!anthropicSettings}
          orgName={orgName}
        />
        <OpenAISettings isConnected={!!openaiSettings} />
      </div>
    </div>
  );
}
