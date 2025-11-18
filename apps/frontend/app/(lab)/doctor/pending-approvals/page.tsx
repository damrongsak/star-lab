"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, FileText } from "lucide-react";
import { usePendingApprovals } from "@/lib/hooks/useDoctor";
import { getErrorMessage } from "@/lib/api/client";

export default function DoctorPendingApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const {
    data: pendingApprovals = [],
    isLoading,
    error,
  } = usePendingApprovals();

  const filteredApprovals = useMemo(() => {
    const query = debouncedSearchTerm?.trim().toLowerCase() ?? "";
    if (!query) {
      return pendingApprovals;
    }

    return pendingApprovals.filter((request) =>
      request.requestNo?.toLowerCase().includes(query),
    );
  }, [pendingApprovals, debouncedSearchTerm]);

  const formatDate = (date?: string | Date) => {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const renderSkeletonRows = () => (
    <div className="p-6 space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
      <p className="text-sm text-muted-foreground">
        {debouncedSearchTerm
          ? "Try a different request number keyword"
          : "You're all caught up for now."}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-muted-foreground">
          Review laboratory requests awaiting your approval
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by request number..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          renderSkeletonRows()
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading approvals</h3>
            <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
          </div>
        ) : filteredApprovals.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{request.requestNo || "-"}</TableCell>
                    <TableCell>{formatDate(request.requestDate)}</TableCell>
                    <TableCell>{request.customer?.companyNameEn || "-"}</TableCell>
                    <TableCell>{request.requesterName || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/doctor/requests/${request.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
