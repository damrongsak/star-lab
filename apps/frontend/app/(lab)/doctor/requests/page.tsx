"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye } from "lucide-react";
import Link from "next/link";
import { usePendingApprovals } from "@/lib/hooks/useDoctor";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function DoctorRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: allRequests = [], isLoading } = usePendingApprovals(searchQuery);

  // Filter requests by status
  const filteredRequests = allRequests.filter((request) => {
    if (statusFilter === "all") return true;
    return request.documentStatus === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      DRAFT: { label: "Draft", variant: "outline" },
      SUBMITTED: { label: "Submitted", variant: "secondary" },
      APPROVED: { label: "Approved", variant: "default" },
      REJECTED: { label: "Rejected", variant: "destructive" },
      RESULT_READY: { label: "Ready for Review", variant: "secondary" },
    };

    const config = statusConfig[status] || { label: status, variant: "outline" };
    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">All Requests</h1>
        <p className="text-muted-foreground">
          View and manage all test requests assigned to you
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by request number or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="RESULT_READY">Ready for Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredRequests.length} Request{filteredRequests.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </div>
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">
                        {request.requestNo || "N/A"}
                      </p>
                      {getStatusBadge(request.documentStatus)}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        Company: {request.customer?.companyNameEn || "Unknown"}
                      </p>
                      <p>
                        Date:{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(request.requestDate || Date.now()))}
                      </p>
                      {request.approvedAt && (
                        <p>
                          Approved:{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(request.approvedAt))}
                        </p>
                      )}
                      {request.rejectedAt && (
                        <p>
                          Rejected:{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(request.rejectedAt))}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link href={`/doctor/requests/${request.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
