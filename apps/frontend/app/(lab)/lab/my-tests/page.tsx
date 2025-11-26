"use client";

import { useState } from "react";
import { useMyTests } from "@/lib/hooks/useLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { FlaskConical, ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function MyTestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useMyTests({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    limit,
  });

  const tests = data?.labTests || [];
  const totalTests = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Status badge color mapping
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
      IN_PROGRESS: "bg-blue-400/10 text-blue-400 border-blue-400/20",
      COMPLETED: "bg-accent/10 text-accent border-accent/20",
      REVIEWED: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    };
    return statusMap[status] || "bg-secondary text-muted-foreground border-border";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Assigned Tests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your laboratory test assignments
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by test code or request..."
              className="h-10 w-full rounded-full border border-border bg-secondary/30 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-accent/50 focus:bg-secondary/50 focus:ring-2 focus:ring-accent/20"
              disabled
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="REVIEWED">Reviewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tests Table */}
      <Card className="border-border bg-card/50">
        <CardHeader className="border-b border-border bg-secondary/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-accent" />
                Assigned Tests
              </div>
            </CardTitle>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              {totalTests} {totalTests === 1 ? 'Test' : 'Tests'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full bg-secondary/50" />
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FlaskConical className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {statusFilter === "ALL" 
                  ? "No tests assigned to you yet" 
                  : `No ${statusFilter.toLowerCase()} tests found`}
              </p>
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Test Code</th>
                    <th className="px-6 py-4 font-medium">Test Name</th>
                    <th className="px-6 py-4 font-medium">Request No</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tests.map((test: any) => (
                    <tr key={test.id} className="group hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-foreground font-medium">
                        {test.testCode}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {test.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono">
                        {test.TestRequest?.requestNo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {test.TestRequest?.Customer?.companyName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge 
                          variant="outline" 
                          className={getStatusBadge(test.status || 'PENDING')}
                        >
                          {(test.status || 'PENDING').replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/lab/requests/${test.testRequestId}`}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-accent hover:text-accent/80 hover:bg-accent/10"
                          >
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {tests.length} of {totalTests} tests
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-border hover:bg-secondary/50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium px-3">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-border hover:bg-secondary/50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
