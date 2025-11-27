"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Plus,
  FileText,
  CreditCard,
  MoreHorizontal,
  Download,
  Smartphone,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data for the "Accounts" style table (Recent Requests)
  const recentRequests = [
    { id: "REQ-20251124-001", date: "24 Nov 2025", status: "In Progress", samples: 3, amount: "$150.00" },
    { id: "REQ-20251123-005", date: "23 Nov 2025", status: "Completed", samples: 1, amount: "$50.00" },
    { id: "REQ-20251120-012", date: "20 Nov 2025", status: "Pending Approval", samples: 5, amount: "$250.00" },
    { id: "REQ-20251118-003", date: "18 Nov 2025", status: "Draft", samples: 0, amount: "$0.00" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Hello, {user?.email?.split("@")[0] || "User"}!
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-accent">AI Insight:</span>
          <span className="text-muted-foreground italic">
            &quot;Your recent testing volume is up 15%. Consider scheduling bulk samples for better efficiency.&quot;
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Requests (Styled as Accounts Table) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Recent Requests</h2>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">LIVE</Badge>
            </div>
            <p className="text-xs text-muted-foreground">DATA UPDATED: TODAY, 9:41 AM</p>
          </div>

          <Card className="border-border bg-card/50">
            <CardContent className="p-0">
              <div className="w-full overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Request ID</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Samples</th>
                      <th className="px-6 py-4 font-medium text-right">Est. Cost</th>
                      <th className="px-6 py-4 font-medium text-center">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentRequests.map((req) => (
                      <tr key={req.id} className="group hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span>{req.id}</span>
                              <span className="text-xs text-muted-foreground md:hidden">{req.status}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{req.date}</td>
                        <td className="px-6 py-4 text-right text-foreground font-mono">{req.samples}</td>
                        <td className="px-6 py-4 text-right text-foreground font-mono">{req.amount}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge 
                            variant="outline" 
                            className={`
                              ${req.status === 'Completed' ? 'text-accent border-accent/20 bg-accent/10' : ''}
                              ${req.status === 'In Progress' ? 'text-blue-400 border-blue-400/20 bg-blue-400/10' : ''}
                              ${req.status === 'Pending Approval' ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10' : ''}
                              ${req.status === 'Draft' ? 'text-muted-foreground border-border bg-secondary' : ''}
                            `}
                          >
                            {req.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Link href="/requests">
              <Button variant="link" className="text-accent hover:text-accent/80 p-0 h-auto">
                View All Requests <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Quick Actions (Styled as Trading Platforms) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
          
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="bg-secondary/30 border-b border-border pb-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                  <Plus className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">New Request</CardTitle>
                  <p className="text-xs text-muted-foreground">Submit samples for testing</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Link href="/requests/new">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                  Start Request
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Supports bulk sample upload
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Other Actions</p>
            
            <Link href="/invoices" className="block">
              <div className="group flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-secondary/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  <span className="text-sm font-medium">View Invoices</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/profile" className="block">
              <div className="group flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-secondary/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  <span className="text-sm font-medium">Profile Settings</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <div className="group flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-secondary/30 transition-all cursor-pointer opacity-50">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Download Reports</span>
              </div>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-secondary/50 to-card border-border mt-4">
            <CardContent className="p-4 flex items-center gap-3">
              <Globe className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Need Help?</p>
                <p className="text-xs text-muted-foreground">Contact support 24/7</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
