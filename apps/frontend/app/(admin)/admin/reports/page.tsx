"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/lib/hooks/useAdmin";
import { FileText, Download, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export default function AdminReportsPage() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    { 
      title: "Total Revenue", 
      value: stats?.totalInvoices ? `${(stats.totalInvoices * 5000).toLocaleString()} THB` : "0 THB",
      icon: DollarSign,
      description: "All-time revenue",
      color: "text-green-500"
    },
    { 
      title: "Total Customers", 
      value: stats?.totalCustomers,
      icon: Users,
      description: "Active customers",
      color: "text-blue-500"
    },
    { 
      title: "Test Requests", 
      value: stats?.totalTestRequests,
      icon: Activity,
      description: "All-time requests",
      color: "text-purple-500"
    },
    { 
      title: "Pending Approvals", 
      value: stats?.pendingApprovals,
      icon: TrendingUp,
      description: "Awaiting approval",
      color: "text-orange-500"
    },
  ];

  const reportTypes = [
    { 
      title: "Financial Report",
      description: "Revenue, invoices, and payment analysis",
      icon: DollarSign
    },
    { 
      title: "Customer Activity Report",
      description: "Customer engagement and request patterns",
      icon: Users
    },
    { 
      title: "Lab Performance Report",
      description: "Turnaround times and efficiency metrics",
      icon: Activity
    },
    { 
      title: "Technician Productivity Report",
      description: "Individual and team performance metrics",
      icon: TrendingUp
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View system-wide statistics and generate reports</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report, index) => (
              <Card key={index} className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <report.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Request Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">Chart will be implemented</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">Chart will be implemented</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
