"use client";

import { useState } from "react";
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
import { Plus, Search, Eye, Pencil, Trash2, FileText } from "lucide-react";
import type { TestRequestDocumentStatus } from "@star-lab/shared";
import { useRequests, useDeleteRequest } from "@/lib/hooks/useRequests";

/**
 * Status Badge Component
 * Displays colored badge based on document status
 */
function StatusBadge({ status }: { status: TestRequestDocumentStatus }) {
  const statusConfig = {
    DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
    SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
    PENDING_PAYMENT: { label: "Pending Payment", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
    APPROVED: { label: "Approved", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
    REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
    CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

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
  const [statusFilter, setStatusFilter] = useState<TestRequestDocumentStatus | "all">("all");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; requestId: string; requestNo: string }>({
    open: false,
    requestId: "",
    requestNo: "",
  });

  // Fetch requests with filters
  const { data: requests = [], isLoading, error } = useRequests({
    search: debouncedSearchTerm,
    status: statusFilter,
  }) as { data: any[]; isLoading: boolean; error: Error | null };

  // Delete request mutation
  const deleteMutation = useDeleteRequest();

  // Handle delete request
  const handleDelete = (requestId: string, requestNo: string) => {
    setDeleteDialog({ open: true, requestId, requestNo });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteDialog.requestId, {
      onSuccess: () => {
        setDeleteDialog({ open: false, requestId: "", requestNo: "" });
      },
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
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
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TestRequestDocumentStatus | "all")}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                      <StatusBadge status={request.documentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/requests/${request.id}`}>
                          <Button variant="ghost" size="sm" title="View Request">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {request.documentStatus === "DRAFT" && (
                          <>
                            <Link href={`/requests/${request.id}/edit`}>
                              <Button variant="ghost" size="sm" title="Edit Request">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(request.id, request.requestNo)}
                              title="Delete Request"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
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
