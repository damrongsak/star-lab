"use client";

import { useState, useEffect } from "react";
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
import type { TestRequest, TestRequestDocumentStatus } from "@star-lab/shared";

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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestNo: string;
  onConfirm: () => void;
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Mock data for testing
 */
const mockCustomer = {
  id: "customer-1",
  userId: "user-1",
  companyName: "ABC Company",
  taxIdOrIdCard: "123456789",
  addressLine1: "123 Main St",
  city: "Bangkok",
  country: "Thailand",
  shippingAddressLine1: "123 Main St",
  shippingCity: "Bangkok",
  shippingCountry: "Thailand",
  registrationStatus: "APPROVED" as const,
  isActive: true,
  createdAt: new Date("2025-10-01"),
  updatedAt: new Date("2025-10-01"),
} as any;

const mockRequests: TestRequest[] = [
  {
    id: "1",
    requestNo: "ABC-20251031-001",
    customerId: "customer-1",
    requesterName: "John Doe",
    objective: "Quality testing",
    requestDate: new Date("2025-10-31"),
    documentStatus: "DRAFT",
    labInternalStatus: "WAITING_APPROVAL_LAB",
    notes: "Sample request for testing",
    createdAt: new Date("2025-10-31"),
    updatedAt: new Date("2025-10-31"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
  {
    id: "2",
    requestNo: "ABC-20251030-005",
    customerId: "customer-1",
    requesterName: "Jane Smith",
    requestDate: new Date("2025-10-30"),
    documentStatus: "SUBMITTED",
    labInternalStatus: "RECEIVED_SAMPLES",
    createdAt: new Date("2025-10-30"),
    updatedAt: new Date("2025-10-31"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
  {
    id: "3",
    requestNo: "ABC-20251029-003",
    customerId: "customer-1",
    requesterName: "Bob Wilson",
    requestDate: new Date("2025-10-29"),
    documentStatus: "PENDING_PAYMENT",
    labInternalStatus: "READY_FOR_APPROVAL",
    createdAt: new Date("2025-10-29"),
    updatedAt: new Date("2025-10-30"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
  {
    id: "4",
    requestNo: "ABC-20251028-002",
    customerId: "customer-1",
    requesterName: "Alice Brown",
    requestDate: new Date("2025-10-28"),
    documentStatus: "APPROVED",
    labInternalStatus: "COMPLETED",
    createdAt: new Date("2025-10-28"),
    updatedAt: new Date("2025-10-29"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
  {
    id: "5",
    requestNo: "ABC-20251027-004",
    customerId: "customer-1",
    requesterName: "Charlie Davis",
    requestDate: new Date("2025-10-27"),
    documentStatus: "REJECTED",
    labInternalStatus: "HOLD",
    notes: "Insufficient sample",
    createdAt: new Date("2025-10-27"),
    updatedAt: new Date("2025-10-28"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
  {
    id: "6",
    requestNo: "ABC-20251026-001",
    customerId: "customer-1",
    requesterName: "Eve Martinez",
    requestDate: new Date("2025-10-26"),
    documentStatus: "DRAFT",
    labInternalStatus: "WAITING_APPROVAL_LAB",
    createdAt: new Date("2025-10-26"),
    updatedAt: new Date("2025-10-26"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
  {
    id: "7",
    requestNo: "ABC-20251025-006",
    customerId: "customer-1",
    requesterName: "Frank Thompson",
    requestDate: new Date("2025-10-25"),
    documentStatus: "APPROVED",
    labInternalStatus: "COMPLETED",
    createdAt: new Date("2025-10-25"),
    updatedAt: new Date("2025-10-26"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
];

/**
 * Requests List Page
 * Displays all test requests for a customer with search and filter
 */
export default function RequestsPage() {
  const [requests, setRequests] = useState<TestRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; requestId: string; requestNo: string }>({
    open: false,
    requestId: "",
    requestNo: "",
  });

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter requests based on search and status
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      debouncedSearchTerm === "" ||
      request.requestNo.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.documentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle delete request
  const handleDelete = (requestId: string, requestNo: string) => {
    setDeleteDialog({ open: true, requestId, requestNo });
  };

  const confirmDelete = () => {
    setRequests((prev) => prev.filter((r) => r.id !== deleteDialog.requestId));
    setDeleteDialog({ open: false, requestId: "", requestNo: "" });
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
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
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No requests found matching your filters
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">{request.requestNo}</TableCell>
                  <TableCell>{formatDate(request.requestDate)}</TableCell>
                  <TableCell>{request.requesterName}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.documentStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/requests/${request.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      {request.documentStatus === "DRAFT" && (
                        <>
                          <Link href={`/requests/${request.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(request.id, request.requestNo)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        requestNo={deleteDialog.requestNo}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
