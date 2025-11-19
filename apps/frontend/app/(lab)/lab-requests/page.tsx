"use client";

import { useState } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Eye, FlaskConical, Search } from "lucide-react";
import { useLabRequests, useAcknowledgeSamples } from "@/lib/hooks/useLab";
import { toast } from "sonner";
import type { TestRequest } from "@star-lab/shared";

type LabRequestStatus = "SUBMITTED" | "SAMPLE_RECEIVED" | "IN_TESTING" | "RESULT_READY";
type FilterStatus = LabRequestStatus | "ALL";

function getDisplayStatus(request: TestRequest): LabRequestStatus {
  if (request.documentStatus === "RESULT_READY") return "RESULT_READY";
  if (request.labInternalStatus === "RECEIVED_SAMPLES") return "SAMPLE_RECEIVED";
  if (["ASSIGNED_TECHNICIAN", "IN_PROGRESS", "RESULTS_UPLOADED", "REVIEWED_BY_DOCTOR", "READY_FOR_APPROVAL", "COMPLETED"].includes(request.labInternalStatus)) return "IN_TESTING";
  return "SUBMITTED";
}

const statusConfig: Record<LabRequestStatus, { label: string; className: string }> = {
  SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  SAMPLE_RECEIVED: { label: "Sample Received", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  IN_TESTING: { label: "In Testing", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  RESULT_READY: { label: "Result Ready", className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
};

const statusFilters: { label: string; value: FilterStatus }[] = [
  { label: "All Status", value: "ALL" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Sample Received", value: "SAMPLE_RECEIVED" },
  { label: "In Testing", value: "IN_TESTING" },
  { label: "Result Ready", value: "RESULT_READY" },
];

function StatusBadge({ status }: { status: LabRequestStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}

function RequestTableSkeleton() {
  return (
    <Card className="p-0">
      <div className="border-b px-6 py-4">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="space-y-3 p-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`skeleton-row-${index}`} className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 p-10 text-center">
      <FlaskConical className="h-12 w-12 text-muted-foreground" />
      <div>
        <h3 className="text-lg font-semibold">No lab requests found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters to find a request.</p>
      </div>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </Card>
  );
}

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "-";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(value);
}

export default function LabRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;
  const searchQuery = debouncedSearch.trim();

  const { data, isLoading } = useLabRequests({
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    search: searchQuery,
    page,
    limit,
  });

  const requests = data?.testRequests;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPage(1);
  };

  // Reset page when filters change
  if (page !== 1 && (searchQuery !== "" || statusFilter !== "ALL") && page > totalPages) {
     setPage(1);
  }
  
  // Better approach: Effect to reset page on filter change
  // However, since we can't add useEffect easily in this replace block without changing more code,
  // let's just handle the page change in the input handlers.

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (value: FilterStatus) => {
    setStatusFilter(value);
    setPage(1);
  };

  const acknowledgeMutation = useAcknowledgeSamples();

  const handleAcknowledge = (requestId: string) => {
    acknowledgeMutation.mutate(
      { id: requestId },
      {
        onSuccess: () => {
          toast.success("Request acknowledged successfully");
        },
        onError: () => {
          toast.error("Failed to acknowledge request");
        },
      }
    );
  };

  const handleEnterResults = (requestNo: string) => {
    console.info(`Entering results for ${requestNo}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Lab Requests</h1>
        <p className="text-muted-foreground">Monitor the status of incoming lab submissions and act quickly.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by request number"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9"
              aria-label="Search requests"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading && <RequestTableSkeleton />}
      {!isLoading && !requests?.length && <EmptyState onReset={resetFilters} />}
      {!!requests?.length && (
        <>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Samples Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((request) => {
                  const samplesCount = request.testRequestSamples?.length ?? 0;
                  const companyName = request.customer?.companyNameEn || "Unknown";
                  const requestDate = request.requestDate || request.createdAt;
                  const normalizedStatus = getDisplayStatus(request);

                  return (
                    <TableRow key={request.requestNo}>
                      <TableCell className="font-medium">{request.requestNo}</TableCell>
                      <TableCell>{formatDate(requestDate)}</TableCell>
                      <TableCell>{companyName}</TableCell>
                      <TableCell>
                        <StatusBadge status={normalizedStatus} />
                      </TableCell>
                      <TableCell className="text-center">{samplesCount}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/requests/${encodeURIComponent(request.requestNo)}`}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </Button>
                          {normalizedStatus === "SUBMITTED" && (
                            <Button variant="secondary" size="sm" onClick={() => handleAcknowledge(request.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Acknowledge
                            </Button>
                          )}
                          {normalizedStatus === "IN_TESTING" && (
                            <Button size="sm" onClick={() => handleEnterResults(request.requestNo)}>
                              <FlaskConical className="mr-2 h-4 w-4" /> Enter Results
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
