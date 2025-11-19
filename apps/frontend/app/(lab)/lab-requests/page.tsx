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
import { useLabRequests } from "@/lib/hooks/useLab";

type LabRequestStatus = "SUBMITTED" | "SAMPLE_RECEIVED" | "IN_TESTING" | "RESULT_READY";
type FilterStatus = LabRequestStatus | "ALL";

function isValidStatus(status: string | null | undefined): status is LabRequestStatus {
  return status === "SUBMITTED" || status === "SAMPLE_RECEIVED" || status === "IN_TESTING" || status === "RESULT_READY";
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
  const searchQuery = debouncedSearch.trim();

  const { data: requests, isLoading } = useLabRequests({
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    search: searchQuery,
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  const handleAcknowledge = (requestNo: string) => {
    console.info(`Acknowledged request ${requestNo}`);
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
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-9"
              aria-label="Search requests"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
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
                const normalizedStatus = isValidStatus(request.status)
                  ? request.status
                  : "SUBMITTED";

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
                          <Button variant="secondary" size="sm" onClick={() => handleAcknowledge(request.requestNo)}>
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
      )}
    </div>
  );
}
