"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const AdminDashboardPage = () => {
  // Placeholder data for stats cards
  const stats = [
    { title: "Total Users", value: "1,234" },
    { title: "Total Customers", value: "567" },
    { title: "Total Test Requests", value: "890" },
    { title: "Pending Approvals", value: "45" },
    { title: "Active Technicians", value: "12" },
    { title: "Total Invoices", value: "321" },
  ];

  // Placeholder data for recent activity
  const recentActivity = [
    { id: "1", action: "User 'John Doe' registered", timestamp: "2025-11-19 10:00 AM" },
    { id: "2", action: "Test Request #ABC-20251118-005 submitted", timestamp: "2025-11-19 09:30 AM" },
    { id: "3", action: "Invoice #INV-20251117-001 marked as paid", timestamp: "2025-11-18 04:00 PM" },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
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
