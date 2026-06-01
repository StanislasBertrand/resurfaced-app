"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { saveOpenAIKey, removeOpenAIKey } from "./actions";

interface OpenAISettingsProps {
  isConnected: boolean;
}

export function OpenAISettings({
  isConnected: initialConnected,
}: OpenAISettingsProps) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!key.trim()) return;
    setError(null);
    setSaving(true);

    const result = await saveOpenAIKey(key.trim());

    if (result.success) {
      setIsConnected(true);
      setKey("");
      setOpen(false);
    } else {
      setError(result.error ?? "Failed to save key");
    }

    setSaving(false);
  }

  async function handleRemove() {
    setError(null);
    setRemoving(true);

    await removeOpenAIKey();
    setIsConnected(false);

    setRemoving(false);
    setOpen(false);
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border bg-background">
              <img
                src="/openai-logo.svg"
                alt="OpenAI"
                className={cn("size-8 dark:invert")}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">OpenAI</h3>
            </div>
          </div>
        </div>
        <div className="border-t bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-end">
            <Button
              size="sm"
              variant={isConnected ? "secondary" : "default"}
              className="h-8"
              onClick={() => setOpen(true)}
            >
              {isConnected ? (
                <>
                  <Check className="size-3.5" />
                  Connected
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Connect OpenAI</DialogTitle>
            <DialogDescription>
              Enter your Admin API key to start tracking usage and costs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
              <p className="font-medium">Admin API key required</p>
              <p className="mt-1">
                We need an <strong>Admin API key</strong> from your organization
                settings. Create one at{" "}
                <a
                  href="https://platform.openai.com/settings/organization/admin-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  platform.openai.com
                </a>
                .
              </p>
              <p className="mt-2">
                This key allows us to{" "}
                <strong>read usage and cost data only</strong>. It cannot run AI
                models or incur charges.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-key">Admin API Key</Label>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-admin-..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={saving}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-between">
              {isConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  disabled={removing}
                >
                  {removing ? "Removing..." : "Remove connection"}
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={handleSave} disabled={saving || !key.trim()}>
                {saving
                  ? "Validating..."
                  : isConnected
                    ? "Update key"
                    : "Connect"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
