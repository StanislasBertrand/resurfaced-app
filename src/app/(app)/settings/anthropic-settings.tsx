"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { saveAnthropicKey, removeAnthropicKey } from "./actions";

interface AnthropicSettingsProps {
  isConnected: boolean;
  orgName?: string;
}

export function AnthropicSettings({
  isConnected: initialConnected,
  orgName: initialOrgName,
}: AnthropicSettingsProps) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [orgName, setOrgName] = useState(initialOrgName);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSave() {
    if (!key.trim()) return;
    setError(null);
    setSuccess(null);
    setSaving(true);

    const result = await saveAnthropicKey(key.trim());

    if (result.success) {
      setIsConnected(true);
      setOrgName(result.orgName);
      setSuccess(`Connected to ${result.orgName}`);
      setKey("");
      setOpen(false);
    } else {
      setError(result.error ?? "Failed to save key");
    }

    setSaving(false);
  }

  async function handleRemove() {
    setError(null);
    setSuccess(null);
    setRemoving(true);

    await removeAnthropicKey();
    setIsConnected(false);
    setOrgName(undefined);

    setRemoving(false);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group flex cursor-pointer flex-col gap-4 rounded-lg border p-4 text-left hover:bg-muted/30 hover:shadow-md",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <img
            src="/anthropic-logo.svg"
            alt="Anthropic"
            className="size-10 sm:size-16 dark:invert"
          />
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800">
              Connected{orgName ? ` — ${orgName}` : ""}
            </Badge>
          ) : (
            <div className="opacity-0 group-hover:opacity-100">
              <ArrowRight className="size-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 text-base">
          <p className="font-medium">Anthropic</p>
          <p className="text-sm text-muted-foreground">
            Track API usage, token consumption, and costs across your organization.
          </p>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Connect Anthropic</DialogTitle>
            <DialogDescription>
              Enter your Admin API key to start tracking usage and costs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
              <p className="font-medium">Admin API key required</p>
              <p className="mt-1">
                We need an <strong>Admin API key</strong> (starts with{" "}
                <code>sk-ant-admin...</code>), not a regular API key. Create one
                in the{" "}
                <a
                  href="https://platform.claude.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Anthropic Console
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
              <Label htmlFor="anthropic-key">Admin API Key</Label>
              <Input
                id="anthropic-key"
                type="password"
                placeholder="sk-ant-admin-..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={saving}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            )}

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
