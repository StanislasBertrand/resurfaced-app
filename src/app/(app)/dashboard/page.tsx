import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { fetchAnthropicCosts } from "@/lib/providers/anthropic";
import { fetchOpenAICosts } from "@/lib/providers/openai";
import { DashboardContent } from "./dashboard-content";

type TimeWindow = "7d" | "30d" | "90d";

function getTimeRange(window: TimeWindow) {
  const days = window === "7d" ? 7 : window === "90d" ? 90 : 30;

  // End at tomorrow midnight UTC to include all of today
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  end.setUTCDate(end.getUTCDate() + 1);

  // Start at midnight UTC X days ago
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);

  return { start, end };
}

interface Props {
  searchParams: Promise<{ window?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const window = (["7d", "30d", "90d"].includes(params.window ?? "")
    ? params.window
    : "30d") as TimeWindow;
  const { start, end } = getTimeRange(window);

  const { workspace } = await getCurrentUser();

  const [anthropicSettings, openaiSettings] = await Promise.all([
    prisma.anthropicSettings.findUnique({
      where: { workspaceId: workspace.id },
    }),
    prisma.openAISettings.findUnique({
      where: { workspaceId: workspace.id },
    }),
  ]);

  const providers: Array<{
    name: string;
    logo: string;
    logoClass?: string;
    cost: number;
    connected: boolean;
  }> = [];

  const [anthropicCost, openaiCost] = await Promise.all([
    anthropicSettings
      ? fetchAnthropicCosts(anthropicSettings.adminApiKey, start, end)
      : Promise.resolve(0),
    openaiSettings
      ? fetchOpenAICosts(openaiSettings.adminApiKey, start, end)
      : Promise.resolve(0),
  ]);

  if (anthropicSettings) {
    providers.push({
      name: "Anthropic",
      logo: "/anthropic-logo.svg",
      logoClass: "dark:invert",
      cost: anthropicCost,
      connected: true,
    });
  }

  if (openaiSettings) {
    providers.push({
      name: "OpenAI",
      logo: "/openai-logo.svg",
      logoClass: "dark:invert",
      cost: openaiCost,
      connected: true,
    });
  }

  const totalCost = providers.reduce((sum, p) => sum + p.cost, 0);

  return (
    <DashboardContent
      providers={providers}
      totalCost={totalCost}
      window={window}
    />
  );
}
