"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkload } from "@/lib/hooks/useDoctor";
import {
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FileTextIcon,
  TrendingUpIcon,
  ActivityIcon
} from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";

export default function DoctorWorkloadPage() {
  const { data: workload, isLoading, error } = useWorkload();

  const stats = [
    {
      title: "Pending Reviews",
      value: workload?.pendingReviews ?? 0,
      icon: ClockIcon,
      description: "Awaiting your approval",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Assigned",
      value: workload?.totalAssigned ?? 0,
      icon: FileTextIcon,
      description: "All time requests",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed This Month",
      value: workload?.completedThisMonth ?? 0,
      icon: ActivityIcon,
      description: "Approved + Rejected",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Turnaround Time",
      value: workload?.averageTurnaroundHours
        ? `${workload.averageTurnaroundHours}h`
        : "N/A",
      icon: TrendingUpIcon,
      description: "Last 30 days",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  const weeklyStats = [
    {
      title: "Approved This Week",
      value: workload?.approvedThisWeek ?? 0,
      icon: CheckCircle2Icon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rejected This Week",
      value: workload?.rejectedThisWeek ?? 0,
      icon: XCircleIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const monthlyStats = [
    {
      title: "Approved This Month",
      value: workload?.approvedThisMonth ?? 0,
      icon: CheckCircle2Icon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rejected This Month",
      value: workload?.rejectedThisMonth ?? 0,
      icon: XCircleIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Workload</h1>
          <p className="text-muted-foreground">
            View your performance metrics and workload statistics
          </p>
        </div>
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <XCircleIcon className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Workload</h3>
            <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Workload</h1>
        <p className="text-muted-foreground">
          View your performance metrics and workload statistics
        </p>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mb-1" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {weeklyStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className={`flex items-center justify-between p-4 rounded-lg border ${stat.bgColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-white`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">{stat.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {monthlyStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className={`flex items-center justify-between p-4 rounded-lg border ${stat.bgColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-white`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">{stat.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {!isLoading && workload && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Monthly Summary
                  </p>
                  <p className="text-lg font-semibold">
                    {workload.completedThisMonth} requests completed this month
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {workload.approvedThisMonth} approved, {workload.rejectedThisMonth} rejected
                  </p>
                </div>
                {workload.averageTurnaroundHours > 0 && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Efficiency
                    </p>
                    <p className="text-2xl font-bold text-teal-600">
                      {workload.averageTurnaroundHours}h
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg turnaround
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ActivityIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">About Your Workload</h4>
              <p className="text-sm text-blue-800">
                These statistics help you track your approval performance and workload distribution.
                The average turnaround time is calculated based on the time between request creation
                and your approval/rejection decision over the last 30 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
