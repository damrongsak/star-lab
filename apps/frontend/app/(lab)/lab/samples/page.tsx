"use client";

import { useState } from "react";
import { useSamples } from "@/lib/hooks/useLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { FlaskConical, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useDebounce } from "use-debounce";

export default function SamplesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const { data, isLoading } = useSamples({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const samples = data?.samples || [];
  const totalSamples = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Status badge color mapping
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
      RECEIVED: "bg-blue-400/10 text-blue-400 border-blue-400/20",
      IN_TESTING: "bg-purple-400/10 text-purple-400 border-purple-400/20",
      CONSUMED: "bg-gray-400/10 text-gray-400 border-gray-400/20",
    };
    return statusMap[status] || "bg-secondary text-muted-foreground border-border";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sample Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and manage all test request samples
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
              placeholder="Search by sample ID, request number, or company..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to first page on search
              }}
              className="h-10 w-full rounded-full border border-border bg-secondary/30 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-accent/50 focus:bg-secondary/50 focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value);
          setPage(1); // Reset to first page on filter change
        }}>
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="IN_TESTING">In Testing</SelectItem>
            <SelectItem value="CONSUMED">Consumed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Samples Table */}
      <Card className="border-border bg-card/50">
        <div className="w-full overflow-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-secondary/50" />
              ))}
            </div>
          ) : samples.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FlaskConical className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "ALL" 
                  ? "No samples found matching your filters" 
                  : "No samples available"}
              </p>
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Sample ID</th>
                    <th className="px-6 py-4 font-medium">Sample Type</th>
                    <th className="px-6 py-4 font-medium">Request No</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-center">Tests</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {samples.map((sample: any) => (
                    <tr key={sample.id} className="group hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-foreground font-medium">
                        {sample.customerSampleId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {sample.sampleType || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono">
                        <Link 
                          href={`/lab/requests/${sample.testRequest?.id}`}
                          className="hover:text-accent transition-colors"
                        >
                          {sample.testRequest?.requestNo || 'N/A'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {sample.testRequest?.customer?.companyNameEn || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge 
                          variant="outline" 
                          className={getStatusBadge(sample.currentStatus || 'PENDING')}
                        >
                          {(sample.currentStatus || 'PENDING').replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                          {sample.labTests?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/lab/requests/${sample.testRequest?.id || sample.id}`}>
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
        </div>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {samples.length} of {totalSamples} samples
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="border-border hover:bg-secondary/50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="px-4 py-2 text-sm font-medium text-foreground">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="border-border hover:bg-secondary/50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
