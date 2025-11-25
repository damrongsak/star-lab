"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAdminStats } from "@/lib/hooks/useAdmin";
import { useRequestVolumeData, useRevenueData, useGenerateReport, useExportReport } from "@/lib/hooks/useReports";
import RequestVolumeChart from "./RequestVolumeChart";
import RevenueChart from "./RevenueChart";
import { FileText, Download, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { toast } from "sonner";

export default function AdminReportsPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: requestVolumeData, isLoading: requestVolumeLoading } = useRequestVolumeData();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [currentReportType, setCurrentReportType] = useState<string>("financial");

  const generateReportMutation = useGenerateReport(currentReportType);
  const exportReportMutation = useExportReport(currentReportType);

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
      icon: DollarSign,
      type: "financial"
    },
    { 
      title: "Customer Activity Report",
      description: "Customer engagement and request patterns",
      icon: Users,
      type: "customer"
    },
    { 
      title: "Lab Performance Report",
      description: "Turnaround times and efficiency metrics",
      icon: Activity,
      type: "lab"
    },
    { 
      title: "Technician Productivity Report",
      description: "Individual and team performance metrics",
      icon: TrendingUp,
      type: "technician"
    },
  ];

  const handleViewReport = async (reportType: string) => {
    setCurrentReportType(reportType);
    try {
      const data = await generateReportMutation.mutateAsync();
      setSelectedReport(data);
      setIsReportDialogOpen(true);
      toast.success("Report generated successfully");
    } catch (error) {
      toast.error("Failed to generate report");
    }
  };

  const handleExportReport = async (reportType: string) => {
    setCurrentReportType(reportType);
    try {
      await exportReportMutation.mutateAsync();
      toast.success("Report exported successfully");
    } catch (error) {
      toast.error("Failed to export report");
    }
  };

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
              {statsLoading ? (
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RequestVolumeChart data={requestVolumeData?.data} isLoading={requestVolumeLoading} />
        <RevenueChart data={revenueData?.data} isLoading={revenueLoading} />
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report, index) => (
              <Card key={index} className="hover:bg-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <report.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewReport(report.type)}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportReport(report.type)}
                        >
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

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
            <DialogDescription>
              Generated on {selectedReport?.generated ? new Date(selectedReport.generated).toLocaleString() : 'N/A'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(selectedReport, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
