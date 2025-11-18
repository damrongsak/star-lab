"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePendingApprovals } from "@/lib/hooks/useDoctor";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorDashboardPage() {
  const { data: pendingApprovals = [], isLoading } = usePendingApprovals();

  const stats = [
    {
      title: "Pending Approvals",
      value: isLoading ? "..." : pendingApprovals.length,
      icon: Clock,
      description: "Awaiting your review",
      href: "/doctor/pending-approvals",
      color: "text-orange-600",
    },
    {
      title: "Approved Today",
      value: 0,
      icon: CheckCircle,
      description: "Completed approvals",
      href: "/doctor/requests",
      color: "text-green-600",
    },
    {
      title: "Total Requests",
      value: isLoading ? "..." : pendingApprovals.length,
      icon: FileText,
      description: "All time requests",
      href: "/doctor/requests",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage laboratory test approvals and review requests
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
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
            <Link href="/doctor/pending-approvals">
              <Button variant="default" className="w-full justify-start" size="lg">
                <Clock className="mr-2 h-5 w-5" />
                Review Pending Approvals
              </Button>
            </Link>
            <Link href="/doctor/requests">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                View All Requests
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Pending Approvals */}
      {!isLoading && pendingApprovals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{request.requestNo || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.customer?.companyNameEn || "Unknown Company"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(request.requestDate || Date.now()))}
                    </span>
                    <Link href={`/doctor/requests/${request.id}`}>
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {pendingApprovals.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/doctor/pending-approvals">
                  <Button variant="outline">View All Pending</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
