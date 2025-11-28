"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import { useApprovalStats } from "@/lib/hooks/useApproval";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ApprovalDashboardPage() {
  const { data: stats, isLoading } = useApprovalStats();

  const statCards = [
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews || 0,
      icon: Clock,
      description: "Awaiting approval",
      href: "/approval/pending-payment",
      color: "text-orange-600",
    },
    {
      title: "Approved This Month",
      value: stats?.approvedThisMonth || 0,
      icon: CheckCircle,
      description: "Approved payments",
      href: "/approval/invoices?status=PAID",
      color: "text-green-600",
    },
    {
      title: "Rejected This Month",
      value: stats?.rejectedThisMonth || 0,
      icon: XCircle,
      description: "Rejected payments",
      href: "/approval/invoices?status=PENDING",
      color: "text-red-600",
    },
    {
      title: "Total Paid",
      value: stats?.totalPaid || 0,
      icon: FileText,
      description: "All paid invoices",
      href: "/approval/invoices",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Approval Dashboard</h1>
        <p className="text-muted-foreground">
          Manage payment approvals and review invoices
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mb-1" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground mb-3">
                  {stat.description}
                </p>
                <Link href={stat.href}>
                  <Button variant="outline" size="sm" className="w-full">
                    View All
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/approval/pending-payment">
              <Button variant="default" className="w-full justify-start" size="lg">
                <Clock className="mr-2 h-5 w-5" />
                Review Pending Payments
              </Button>
            </Link>
            <Link href="/approval/invoices">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                View All Invoices
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
