"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Printer, CreditCard, FileText } from "lucide-react";
import type { Invoice, InvoicePaymentStatus } from "@star-lab/shared";
import { toast } from "sonner";

/**
 * Payment Status Badge
 */
function PaymentStatusBadge({ status }: { status: InvoicePaymentStatus }) {
  const statusConfig = {
    PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    PAID: { label: "Paid", className: "bg-green-100 text-green-700 border-green-300" },
    OVERDUE: { label: "Overdue", className: "bg-red-100 text-red-700 border-red-300" },
    CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-700 border-gray-300" },
    REFUNDED: { label: "Refunded", className: "bg-blue-100 text-blue-700 border-blue-300" },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

/**
 * Mock invoice data - same as in list page
 */
const mockInvoice: Invoice = {
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
};

/**
 * Invoice Detail Page
 */
export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (invoiceId === "1" || invoiceId === "2" || invoiceId === "3" || invoiceId === "4" || invoiceId === "5") {
        setInvoice({ ...mockInvoice, id: invoiceId });
      }
      setIsLoading(false);
    }, 500);
  }, [invoiceId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(amount);
  };

  const handlePay = () => {
    toast.info("Payment functionality will be available soon");
  };

  const handleDownload = () => {
    toast.success(`Downloading invoice ${invoice?.invoiceNo}`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/invoices")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Invoice Not Found</h3>
            <p className="text-sm text-muted-foreground">
              The invoice you&apos;re looking for doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoiceNo}</h1>
            <p className="text-muted-foreground">Invoice Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          {(invoice.paymentStatus === "PENDING" || invoice.paymentStatus === "OVERDUE") && (
            <Button onClick={handlePay}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Summary</CardTitle>
            <PaymentStatusBadge status={invoice.paymentStatus} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium mb-1">Issue Date</p>
              <p className="text-sm text-muted-foreground">
                {invoice.invoiceDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Due Date</p>
              <p className="text-sm text-muted-foreground">
                {invoice.dueDate
                  ? invoice.dueDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.invoiceLineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.lineTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoice.subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({invoice.taxRate}%):</span>
              <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold">{formatCurrency(invoice.netTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
