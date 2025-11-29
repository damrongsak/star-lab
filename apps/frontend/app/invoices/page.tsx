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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Search, Eye, FileText, Plus } from "lucide-react";
import type { InvoicePaymentStatus } from "@star-lab/shared";
import { useInvoices } from "@/lib/hooks/useInvoices";

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
    <Badge variant="outline" className={`px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}

/**
 * Invoices List Page
 */
export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoicePaymentStatus | "all">("all");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const filters = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm.trim();
    return {
      search: trimmedSearch ? trimmedSearch : undefined,
      status: statusFilter,
      page,
      limit,
    };
  }, [debouncedSearchTerm, statusFilter, page, limit]);

  const {
    data,
    isLoading,
    error,
  } = useInvoices(filters);

  const invoices = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.currentPage || 1;

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
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
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">View and manage your laboratory test invoices</p>
        </div>
        <Link href="/requests/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Test Request
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InvoicePaymentStatus | "all")}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Unpaid</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Error loading invoices</h3>
            <p className="text-sm text-muted-foreground">
              There was an error loading your invoices. Please try again.
            </p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No invoices found</h3>
            <p className="text-sm text-muted-foreground">
              {debouncedSearchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "You don&apos;t have any invoices yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Test Request No</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                    <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                    <TableCell>{invoice.testRequest?.requestNo || "-"}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(invoice.netTotal)}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={invoice.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View invoice</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && invoices.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {invoices.length} of {data?.total || 0} invoices
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
