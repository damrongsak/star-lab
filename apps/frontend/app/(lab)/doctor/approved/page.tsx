"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, FileText, CheckCircle2 } from "lucide-react";
import { useApprovedRequests } from "@/lib/hooks/useDoctor";
import { getErrorMessage } from "@/lib/api/client";

export default function DoctorApprovedRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: approvedRequests = [],
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
  } = useApprovedRequests(debouncedSearchTerm, page, limit);

  // Reset page when search changes
  // Note: Search is currently client-side only on the paginated results if backend doesn't support it,
  // but we pass it to the hook in case backend supports it.
  // Since backend doesn't support search yet, this might only search the current page if we relied on backend.
  // However, the previous implementation used client-side filtering on ALL results.
  // Now we receive paginated results.
  // Ideally backend should handle search.
  
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
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
      <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No approved requests</h3>
      <p className="text-sm text-muted-foreground">
        {debouncedSearchTerm
          ? "Try a different request number keyword"
          : "You haven't approved any requests yet."}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Approved Requests</h1>
        <p className="text-muted-foreground">
          View all laboratory requests you have approved
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by request number..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1); // Reset to first page on search
              }}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="whitespace-nowrap">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {total} {total === 1 ? "Request" : "Requests"}
            </Badge>
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          renderSkeletonRows()
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading approved requests</h3>
            <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
          </div>
        ) : approvedRequests.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request No</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{request.requestNo || "-"}</TableCell>
                      <TableCell>{formatDate(request.requestDate)}</TableCell>
                      <TableCell>{request.approvedAt ? formatDate(request.approvedAt) : "-"}</TableCell>
                      <TableCell>{request.customer?.companyNameEn || "-"}</TableCell>
                      <TableCell>{request.requesterName || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Approved
                        </Badge>
                      </TableCell>
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
