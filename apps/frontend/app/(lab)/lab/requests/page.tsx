"use client";

import { useState } from "react";
import { useLabRequests } from "@/lib/hooks/useLab";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import Link from "next/link";
import { Eye, FlaskConical, Receipt } from "lucide-react";
import { TestRequest, PaginatedResponse, InvoicePaymentStatus } from "@star-lab/shared";

/**
 * Payment Status Badge Component
 */
function PaymentStatusBadge({ status }: { status: InvoicePaymentStatus }) {
  const statusConfig: Record<InvoicePaymentStatus, { label: string; className: string }> = {
    PENDING: {
      label: "Unpaid",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    },
    WAITING_VERIFICATION: {
      label: "Waiting Verification",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    },
    PAID: {
      label: "Paid",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    },
    OVERDUE: {
      label: "Overdue",
      className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
    REFUNDED: {
      label: "Refunded",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    },
  };

  const config = statusConfig[status] ?? statusConfig.PENDING;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

/**
 * Lab Status Badge Component
 */
function LabStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    WAITING_APPROVAL_LAB: {
      label: "Waiting Approval",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    SUBMITTED: {
      label: "Submitted",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    RECEIVED_SAMPLES: {
      label: "Received Samples",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    },
    RECEIVED: {
      label: "Received",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    ASSIGNED_TECHNICIAN: {
      label: "Assigned Technician",
      className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    RESULTS_UPLOADED: {
      label: "Results Uploaded",
      className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    },
    RESULT_READY: {
      label: "Result Ready",
      className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    APPROVED: {
      label: "Approved",
      className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    },
    HOLD: {
      label: "Hold",
      className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    },
    READY_FOR_APPROVAL: {
      label: "Ready for Approval",
      className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    },
  };

  const config = statusConfig[status] ?? {
    label: status.replace(/_/g, " "),
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export default function LabRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading } = useLabRequests(
    {
      status: statusFilter === "ALL" ? undefined : statusFilter,
      search: searchQuery,
      page,
      limit,
    }
  ) as { data: PaginatedResponse<TestRequest> | undefined, isLoading: boolean };
  
  const requests = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Requests</h1>
          <p className="text-muted-foreground">
            Manage incoming test requests and samples.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Input
              placeholder="Search by Request No or Company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="WAITING_APPROVAL_LAB">Waiting Approval</SelectItem>
                <SelectItem value="RECEIVED_SAMPLES">Received Samples</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESULTS_UPLOADED">Results Uploaded</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
  <TableHead>Samples</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests?.map((request: TestRequest) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.requestNo}
                      </TableCell>
                      <TableCell>{request.customer?.companyNameEn || request.customer?.companyNameTh || "-"}</TableCell>
                      <TableCell>
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </TableCell>
                      <TableCell>{request.testRequestSamples?.length || 0}</TableCell>
                      
<TableCell>
                        {request.invoices && request.invoices.length > 0
                          ? new Intl.NumberFormat("th-TH", {
                              style: "currency",
                              currency: "THB",
                            }).format(request.invoices[0].netTotal || 0)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {request.invoices && request.invoices.length > 0 ? (
                          <PaymentStatusBadge status={request.invoices[0].paymentStatus} />
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <LabStatusBadge status={request.labInternalStatus || request.documentStatus || "UNKNOWN"} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {request.invoices && request.invoices.length > 0 && (
                            <Link href={`/invoices/${request.invoices[0].id}`}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="View Invoice"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                              >
                                <Receipt className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          {(request.labInternalStatus === "WAITING_APPROVAL_LAB" || request.documentStatus === "SUBMITTED") && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/lab/requests/${request.id}/acknowledge`}>
                                <FlaskConical className="mr-2 h-4 w-4" />
                                Acknowledge
                              </Link>
                            </Button>
                          )}
                          {(request.labInternalStatus === "RECEIVED_SAMPLES" || request.labInternalStatus === "IN_PROGRESS" || request.labInternalStatus === "ASSIGNED_TECHNICIAN") && (
                             <Button size="sm" variant="outline" asChild>
                              <Link href={`/lab/requests/${request.id}/results`}>
                                <FlaskConical className="mr-2 h-4 w-4" />
                                Results
                              </Link>
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/requests/${request.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && requests && requests.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {requests.length} of {data?.total || 0} requests
          </div>
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages || 1}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </div>
  );
}
