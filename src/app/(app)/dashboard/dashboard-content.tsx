"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Provider {
  name: string;
  logo: string;
  logoClass?: string;
  cost: number;
  connected: boolean;
}

interface DashboardContentProps {
  providers: Provider[];
  totalCost: number;
  window: string;
}

function formatCost(cost: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cost);
}

export function DashboardContent({
  providers,
  totalCost,
  window,
}: DashboardContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedWindow, setSelectedWindow] = useState(window);

  function handleWindowChange(value: string | null) {
    if (value) {
      setSelectedWindow(value);
      startTransition(() => {
        router.push(`/dashboard?window=${value}`);
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Select value={selectedWindow} onValueChange={handleWindowChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <div className="text-3xl font-bold">{formatCost(totalCost)}</div>
            )}
          </CardContent>
        </Card>

        {providers.map((provider) => (
          <Card key={provider.name}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className={cn("size-5", provider.logoClass)}
                />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {provider.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <Skeleton className="h-9 w-28" />
              ) : (
                <div className="text-3xl font-bold">
                  {formatCost(provider.cost)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
