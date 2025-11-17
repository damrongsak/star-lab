"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, FileText, Upload, CheckCircle, Clock } from "lucide-react";
import type { InvoicePaymentStatus } from "@star-lab/shared";
import { useInvoice, useMarkInvoicePaid } from "@/lib/hooks/useInvoices";
import { toast } from "sonner";

interface PaymentStatusConfig {
  label: string;
  className: string;
}

const paymentStatusStyles: Record<InvoicePaymentStatus, PaymentStatusConfig> = {
  PENDING: {
    label: "Unpaid",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
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

function PaymentStatusBadge({ status }: { status: InvoicePaymentStatus }) {
  const config = paymentStatusStyles[status] ?? paymentStatusStyles.PENDING;

  return (
    <Badge variant="outline" className={`px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}

const formatDate = (date?: Date | string | null) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(date));
};

const formatCurrency = (amount?: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount ?? 0);
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-64" />
      </div>
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: invoice, isLoading, error } = useInvoice(invoiceId);
  const { mutateAsync: markInvoicePaid, isPending: isUploading } = useMarkInvoicePaid();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUploadPaymentSlip = async () => {
    if (!selectedFile) {
      toast.error("Please select a payment slip to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("paymentSlip", selectedFile);

      await markInvoicePaid({ invoiceId, formData });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (uploadError) {
      console.error("Failed to upload payment slip", uploadError);
    }
  };

  const renderErrorState = () => {
    const message = typeof error === "string" ? error : "Unable to load this invoice.";

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/invoices")}> 
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Invoice Not Found</h3>
            <p className="text-sm text-muted-foreground mb-4">{message}</p>
            <Link href="/invoices">
              <Button>Go to Invoices</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !invoice) {
    return renderErrorState();
  }

  const isUnpaidStatus = invoice.paymentStatus === "PENDING" || invoice.paymentStatus === "OVERDUE";
  const taxPercentage = Math.round((invoice.taxRate ?? 0) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoiceNo}</h1>
            <p className="text-muted-foreground">Invoice Details</p>
          </div>
        </div>
      </div>

      {/* Invoice Information */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Invoice Information</CardTitle>
            <CardDescription>Billing and status overview</CardDescription>
          </div>
          <PaymentStatusBadge status={invoice.paymentStatus} />
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
            <p className="text-base font-semibold">{invoice.invoiceNo}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
            <p className="text-base">{formatDate(invoice.invoiceDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Due Date</p>
            <p className="text-base">{invoice.dueDate ? formatDate(invoice.dueDate) : "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
            <div className="mt-1">
              <PaymentStatusBadge status={invoice.paymentStatus} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Request Information */}
      <Card>
        <CardHeader>
          <CardTitle>Test Request Information</CardTitle>
          <CardDescription>Linked laboratory request details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Request Number</p>
            {invoice.testRequest?.id ? (
              <Link
                href={`/requests/${invoice.testRequest.id}`}
                className="text-base font-medium text-primary hover:underline"
              >
                {invoice.testRequest.requestNo}
              </Link>
            ) : (
              <p className="text-base">-</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Requester Name</p>
            <p className="text-base">{invoice.testRequest?.requesterName || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Request Date</p>
            <p className="text-base">{formatDate((invoice.testRequest as any)?.requestDate)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
          <CardDescription>Breakdown of billable tests</CardDescription>
        </CardHeader>
        <CardContent>
          {invoice.invoiceLineItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No line items available for this invoice.</p>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Line Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.invoiceLineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(item.lineTotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center justify-end gap-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoice.subTotal)}</span>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <span className="text-muted-foreground">Tax ({taxPercentage}%)</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex items-center justify-end gap-4 text-base">
                  <span className="font-semibold">Net Total</span>
                  <span className="font-semibold">{formatCurrency(invoice.netTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Submit or review payment confirmation</CardDescription>
        </CardHeader>
        <CardContent>
          {isUnpaidStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Please upload a payment slip to mark this invoice as paid.
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">Selected file: {selectedFile.name}</p>
              )}
              <Button onClick={handleUploadPaymentSlip} disabled={!selectedFile || isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Payment Slip"}
              </Button>
              {invoice.paymentSlipAttachmentUrl && (
                <p className="text-xs text-muted-foreground">
                  Existing slip: <Link href={invoice.paymentSlipAttachmentUrl} className="text-primary hover:underline">View current file</Link>
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                <CheckCircle className="h-5 w-5" />
                Invoice marked as paid
              </div>
              {invoice.paymentSlipAttachmentUrl ? (
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5001'}${invoice.paymentSlipAttachmentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  View payment slip
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Payment confirmed. No attachment available.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
