"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Search, Eye, Pencil, Trash2, FileText, CreditCard, Receipt } from "lucide-react";
import type { TestRequestDocumentStatus } from "@star-lab/shared";
import { useRequests, useDeleteRequest } from "@/lib/hooks/useRequests";
import { useProjects } from "@/lib/hooks/useProjects";
import { PaymentStatusBadge, DocumentStatusBadge } from "@/components/ui/badge";

type StatusFilter = TestRequestDocumentStatus | "all";

const DOCUMENT_STATUS_VALUES: ReadonlyArray<TestRequestDocumentStatus> = [
  "DRAFT",
  "SUBMITTED",
  "PENDING_PAYMENT",
  "RESULT_READY",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "RESULT_READY", label: "Result Ready" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

const isDocumentStatus = (
  value: string,
): value is TestRequestDocumentStatus => DOCUMENT_STATUS_VALUES.includes(value as TestRequestDocumentStatus);

/**
 * Delete Confirmation Dialog Component
 */
function DeleteConfirmDialog({
  open,
  onOpenChange,
  requestNo,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestNo: string;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Test Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete request <strong>{requestNo}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Requests List Page
 * Displays all test requests for a customer with search and filter
 */
export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; requestNo: string }>({
    open: false,
    id: "",
    requestNo: "",
  });

  const { data: projectsResponse } = useProjects();
  const projects = projectsResponse?.data || [];

  const filters = useMemo(
    () => ({
      search: debouncedSearchTerm?.trim() ? debouncedSearchTerm.trim() : undefined,
      status: statusFilter,
      projectId: projectFilter !== "all" ? projectFilter : undefined,
      page,
      limit,
    }),
    [debouncedSearchTerm, statusFilter, projectFilter, page, limit],
  );

  const {
    data,
    isLoading,
    error,
  } = useRequests(filters);

  const requests = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.currentPage || 1;

  const handleStatusFilterChange = (value: string) => {
    if (value === "all") {
      setStatusFilter("all");
      return;
    }

    if (isDocumentStatus(value)) {
      setStatusFilter(value);
    }
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    //setPage(1);
  }, [debouncedSearchTerm, statusFilter, projectFilter]);

  // Delete request mutation
  const deleteMutation = useDeleteRequest();

  // Handle delete request
  const handleDelete = (id: string, requestNo: string) => {
    setDeleteDialog({ open: true, id, requestNo });
  };

  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteDialog.id);
      setDeleteDialog({ ...deleteDialog, open: false });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount ?? 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Test Requests</h1>
          <p className="text-muted-foreground">
            View and manage your laboratory test requests
          </p>
        </div>
        <Link href="/requests/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Request
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by request number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.projectCode} - {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Requests</h3>
            <p className="text-sm text-muted-foreground">
              There was an error loading your requests. Please try again.
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No requests found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {debouncedSearchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "You haven&apos;t created any test requests yet"}
            </p>
            {!debouncedSearchTerm && statusFilter === "all" && (
              <Link href="/requests/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Request
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request No</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Samples</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{request.requestNo}</TableCell>
                    <TableCell>{formatDate(request.requestDate)}</TableCell>
                    <TableCell>{request.requesterName || "-"}</TableCell>
                    <TableCell>{request.customer?.companyNameEn || "-"}</TableCell>
                    <TableCell>
                      {request.testRequestSamples?.length || 0}
                    </TableCell>
                    <TableCell>
                      {request.invoices && request.invoices.length > 0
                        ? formatCurrency(request.invoices[0].netTotal || 0)
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
                      <DocumentStatusBadge status={request.documentStatus} />
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
                        <Link href={`/requests/${request.id}`}>
                          <Button variant="ghost" size="sm" title="View Request">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {request.documentStatus === "PENDING_PAYMENT" &&
                          request.invoices &&
                          request.invoices.length > 0 && (
                            <Link href={`/invoices/${request.invoices[0].id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Pay / Upload Slip"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        {request.documentStatus === "DRAFT" && (
                          <Link href={`/requests/${request.id}/edit`}>
                            <Button variant="ghost" size="sm" title="Edit Request">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        {request.documentStatus === "DRAFT" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(request.id, request.requestNo)}
                            title="Delete Request"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {!isLoading && !error && requests.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {requests.length} of {data?.total || 0} requests
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        requestNo={deleteDialog.requestNo}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
