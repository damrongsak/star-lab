"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle,
  CreditCard,
  Plus,
  List,
  Receipt,
  TrendingUp,
} from "lucide-react";

/**
 * Stat Card Component
 * Displays a statistic with icon, label, and value
 */
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
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
        {trend && (
          <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
            <TrendingUp className="mr-1 h-3 w-3" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Quick Action Button Component
 */
function QuickActionButton({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-accent cursor-pointer">
        <CardContent className="flex items-start space-x-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Customer Dashboard Page
 * Main dashboard for customer users showing overview and quick actions
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your laboratory test requests and activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={0}
          description="All time test requests"
          icon={FileText}
        />
        <StatCard
          title="Pending Approval"
          value={0}
          description="Awaiting lab approval"
          icon={Clock}
        />
        <StatCard
          title="Completed Tests"
          value={0}
          description="Results available"
          icon={CheckCircle}
        />
        <StatCard
          title="Unpaid Invoices"
          value={0}
          description="Requires payment"
          icon={CreditCard}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QuickActionButton
            href="/requests/new"
            icon={Plus}
            label="Create New Request"
            description="Submit a new laboratory test request"
          />
          <QuickActionButton
            href="/requests"
            icon={List}
            label="View All Requests"
            description="See all your test requests and their status"
          />
          <QuickActionButton
            href="/invoices"
            icon={Receipt}
            label="View Invoices"
            description="Check invoices and upload payment confirmations"
          />
        </div>
      </div>

      {/* Recent Activity Section - Placeholder for future implementation */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest test requests and updates will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No recent activity to display
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Create your first test request to get started
              </p>
              <Link href="/requests/new">
                <Button className="mt-4" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
