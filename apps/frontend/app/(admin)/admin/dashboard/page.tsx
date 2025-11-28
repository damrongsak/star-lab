"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats, useAuditLogs } from "@/lib/hooks/useAdmin";

const AdminDashboardPage = () => {
  const router = useRouter();
  const { data: stats, isLoading: isStatsLoading, error: statsError } = useAdminStats();
  const { data: auditData, isLoading: isAuditLoading, error: auditError } = useAuditLogs(1, 5);

  if (statsError) {
    console.error("Admin stats error:", statsError);
  }
  if (auditError) {
    console.error("Audit logs error:", auditError);
  }

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers },
    { title: "Total Customers", value: stats?.totalCustomers },
    { title: "Total Test Requests", value: stats?.totalTestRequests },
    { title: "Pending Approvals", value: stats?.pendingApprovals },
    { title: "Active Technicians", value: stats?.activeTechnicians },
    { title: "Total Invoices", value: stats?.totalInvoices },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {(statsError || auditError) && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error loading dashboard data</p>
          <p className="text-sm">{statsError?.message || auditError?.message}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value?.toLocaleString() ?? 0}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Button onClick={() => router.push("/admin/users")}>Manage Users</Button>
        <Button onClick={() => router.push("/admin/reports")}>View Reports</Button>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAuditLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  </TableRow>
                ))
              ) : auditData?.logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No recent activity found.
                  </TableCell>
                </TableRow>
              ) : (
                auditData?.logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <span className="font-medium">{log.action}</span>
                      {log.user?.email && <span className="text-muted-foreground text-sm ml-2">by {log.user.email}</span>}
                      <div className="text-xs text-muted-foreground">
                         {log.entityType} {log.entityId && `- ${log.entityId}`}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;