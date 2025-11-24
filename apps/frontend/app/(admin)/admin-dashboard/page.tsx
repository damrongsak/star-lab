"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/lib/hooks/useAdmin";

const AdminDashboardPage = () => {
  const { data: stats, isLoading } = useAdminStats();

  // Placeholder data for recent activity (Backend API for activity logs not yet implemented)
  const recentActivity = [
    { id: "1", action: "User 'John Doe' registered", timestamp: "2025-11-19 10:00 AM" },
    { id: "2", action: "Test Request #ABC-20251118-005 submitted", timestamp: "2025-11-19 09:30 AM" },
    { id: "3", action: "Invoice #INV-20251117-001 marked as paid", timestamp: "2025-11-18 04:00 PM" },
  ];

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
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
        <Button onClick={() => console.log("Manage Users")}>Manage Users</Button>
        <Button onClick={() => console.log("View Reports")}>View Reports</Button>
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
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;