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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Download, FileText, CreditCard } from "lucide-react";
import type { Invoice, InvoicePaymentStatus } from "@star-lab/shared";
import { toast } from "sonner";

/**
 * Payment Status Badge Component
 */
function PaymentStatusBadge({ status }: { status: InvoicePaymentStatus }) {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    PAID: {
      label: "Paid",
      className: "bg-green-100 text-green-700 border-green-300",
    },
    OVERDUE: {
      label: "Overdue",
      className: "bg-red-100 text-red-700 border-red-300",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-gray-100 text-gray-700 border-gray-300",
    },
    REFUNDED: {
      label: "Refunded",
      className: "bg-blue-100 text-blue-700 border-blue-300",
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

/**
 * Mock data for testing
 */
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNo: "INV-2025-001",
    testRequestId: "req-1",
    customerId: "customer-1",
    invoiceDate: new Date("2025-10-31"),
    dueDate: new Date("2025-11-14"),
    subTotal: 15000,
    taxRate: 7,
    taxAmount: 1050,
    netTotal: 16050,
    paymentStatus: "PENDING",
    createdAt: new Date("2025-10-31"),
    updatedAt: new Date("2025-10-31"),
    invoiceLineItems: [
      {
        id: "line-1",
        invoiceId: "1",
        description: "Complete Blood Count Test",
        quantity: 2,
        unitPrice: 5000,
        lineTotal: 10000,
        createdAt: new Date("2025-10-31"),
        updatedAt: new Date("2025-10-31"),
      },
      {
        id: "line-2",
        invoiceId: "1",
        description: "Histopathology Test",
        quantity: 1,
        unitPrice: 5000,
        lineTotal: 5000,
        createdAt: new Date("2025-10-31"),
        updatedAt: new Date("2025-10-31"),
      },
    ],
  },
  {
    id: "2",
    invoiceNo: "INV-2025-002",
    testRequestId: "req-2",
    customerId: "customer-1",
    invoiceDate: new Date("2025-10-28"),
    dueDate: new Date("2025-11-11"),
    subTotal: 8000,
    taxRate: 7,
    taxAmount: 560,
    netTotal: 8560,
    paymentStatus: "PAID",
    createdAt: new Date("2025-10-28"),
    updatedAt: new Date("2025-10-29"),
    invoiceLineItems: [
      {
        id: "line-3",
        invoiceId: "2",
        description: "Blood Test Panel",
        quantity: 1,
        unitPrice: 8000,
        lineTotal: 8000,
        createdAt: new Date("2025-10-28"),
        updatedAt: new Date("2025-10-28"),
      },
    ],
  },
  {
    id: "3",
    invoiceNo: "INV-2025-003",
    testRequestId: "req-3",
    customerId: "customer-1",
    invoiceDate: new Date("2025-10-15"),
    dueDate: new Date("2025-10-29"),
    subTotal: 12000,
    taxRate: 7,
    taxAmount: 840,
    netTotal: 12840,
    paymentStatus: "OVERDUE",
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2025-10-15"),
    invoiceLineItems: [
      {
        id: "line-4",
        invoiceId: "3",
        description: "Comprehensive Test Package",
        quantity: 1,
        unitPrice: 12000,
        lineTotal: 12000,
        createdAt: new Date("2025-10-15"),
        updatedAt: new Date("2025-10-15"),
      },
    ],
  },
  {
    id: "4",
    invoiceNo: "INV-2025-004",
    testRequestId: "req-4",
    customerId: "customer-1",
    invoiceDate: new Date("2025-10-20"),
    dueDate: new Date("2025-11-03"),
    subTotal: 6000,
    taxRate: 7,
    taxAmount: 420,
    netTotal: 6420,
    paymentStatus: "PAID",
    createdAt: new Date("2025-10-20"),
    updatedAt: new Date("2025-10-22"),
    invoiceLineItems: [
      {
        id: "line-5",
        invoiceId: "4",
        description: "Routine Check-up Tests",
        quantity: 2,
        unitPrice: 3000,
        lineTotal: 6000,
        createdAt: new Date("2025-10-20"),
        updatedAt: new Date("2025-10-20"),
      },
    ],
  },
  {
    id: "5",
    invoiceNo: "INV-2025-005",
    testRequestId: "req-5",
    customerId: "customer-1",
    invoiceDate: new Date("2025-10-25"),
    dueDate: new Date("2025-11-08"),
    subTotal: 10000,
    taxRate: 7,
    taxAmount: 700,
    netTotal: 10700,
    paymentStatus: "PENDING",
    createdAt: new Date("2025-10-25"),
    updatedAt: new Date("2025-10-25"),
    invoiceLineItems: [
      {
        id: "line-6",
        invoiceId: "5",
        description: "Pathology Analysis",
        quantity: 1,
        unitPrice: 10000,
        lineTotal: 10000,
        createdAt: new Date("2025-10-25"),
        updatedAt: new Date("2025-10-25"),
      },
    ],
  },
];

/**
 * Invoices List Page
 */
export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setInvoices(mockInvoices);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoiceNo
      .toLowerCase()
      .includes(debouncedSearchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePayment = (invoiceId: string) => {
    toast.info("Payment functionality will be available soon");
  };

  const handleDownload = (invoiceNo: string) => {
    toast.success(`Downloading invoice ${invoiceNo}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          View and manage your laboratory test invoices
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by invoice number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
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
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNo}
                    </TableCell>
                    <TableCell>
                      {invoice.invoiceDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {invoice.dueDate
                        ? invoice.dueDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.netTotal)}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={invoice.paymentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/invoices/${invoice.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(invoice.invoiceNo)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.paymentStatus === "PENDING" ||
                        invoice.paymentStatus === "OVERDUE" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePayment(invoice.id)}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay
                          </Button>
                        ) : null}
                      </div>
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
