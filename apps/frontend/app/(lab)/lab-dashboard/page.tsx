"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLabStats } from "@/lib/hooks/useLab";
import {
  BadgeCheck,
  Beaker,
  CheckCircle2,
  ClipboardList,
  ListChecks,
} from "lucide-react";

type IconType = ComponentType<{ className?: string }>;

type LabStatKey =
  | "pendingRequests"
  | "inProgress"
  | "completedToday"
  | "totalSamples";

const STAT_SUMMARY: Array<{
  title: string;
  description: string;
  icon: IconType;
  valueKey: LabStatKey;
}> = [
  {
    title: "Pending Requests",
    description: "Awaiting initial review",
    icon: ClipboardList,
    valueKey: "pendingRequests",
  },
  {
    title: "In Progress",
    description: "Currently being processed",
    icon: Beaker,
    valueKey: "inProgress",
  },
  {
    title: "Completed Today",
    description: "Results released in last 24h",
    icon: CheckCircle2,
    valueKey: "completedToday",
  },
  {
    title: "Total Samples",
    description: "Samples tracked this week",
    icon: ListChecks,
    valueKey: "totalSamples",
  },
];

const QUICK_ACTIONS: Array<{
  label: "View Requests" | "Acknowledge Samples";
  description: string;
  href: string;
  icon: IconType;
  variant: "default" | "outline";
}> = [
  {
    label: "View Requests",
    description: "Monitor all open lab work",
    href: "/requests",
    icon: ClipboardList,
    variant: "default",
  },
  {
    label: "Acknowledge Samples",
    description: "Confirm specimen receipt",
    href: "/samples",
    icon: BadgeCheck,
    variant: "outline",
  },
];

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: IconType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function LabDashboardPage() {
  const { data: stats, isLoading } = useLabStats();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lab Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time visibility into lab operations and upcoming priorities.
        </p>
      </div>

      <section>
        <div className="grid gap-4 md:grid-cols-2">
          {STAT_SUMMARY.map(({ valueKey, ...stat }) => (
            <StatCard
              key={stat.title}
              {...stat}
              value={String(stats?.[valueKey] ?? 0)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">
            Jump into the tasks you handle most often.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {QUICK_ACTIONS.map(({ label, description, href, icon: Icon, variant }) => (
            <Card key={label} className="flex flex-col justify-between">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={href}>
                  <Button variant={variant} size="lg" className="w-full justify-start">
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
