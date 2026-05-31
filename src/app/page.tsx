import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <Badge variant="secondary" className="text-sm font-medium">
          Now in early access
        </Badge>

        <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Know what your AI
          <br />
          actually costs
        </h1>

        <p className="max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Unified billing across Anthropic, OpenAI, Mistral, and Gemini.
          One dashboard for every token, every dollar, every team.
        </p>

        <div className="flex gap-4">
          <a href="/dashboard">
            <Button size="lg">Get started</Button>
          </a>
          <a href="https://resurfaced.dev">
            <Button size="lg" variant="outline">Learn more</Button>
          </a>
        </div>
      </main>
    </div>
  );
}
