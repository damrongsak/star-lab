"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react";
import { usePendingPayments, useApprovePayment, useRejectPayment } from "@/lib/hooks/useApproval";
import { useQueryClient } from "@tanstack/react-query";

export default function PendingPaymentPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading } = usePendingPayments({ page, limit: 10, search });
  const approveMutation = useApprovePayment();
  const rejectMutation = useRejectPayment();

  const handleApprove = async (invoiceId: string) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await approveMutation.mutateAsync(invoiceId);
      setSuccessMessage("Payment approved successfully");
      queryClient.invalidateQueries({ queryKey: ["approval"] });
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to approve payment");
    }
  };

  const handleReject = async () => {
    if (!selectedInvoice || !rejectReason.trim()) {
      setErrorMessage("Please provide a rejection reason");
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");
      await rejectMutation.mutateAsync({
        invoiceId: selectedInvoice.id,
        reason: rejectReason,
      });
      setSuccessMessage("Payment rejected and reverted to pending");
      setIsRejectDialogOpen(false);
      setRejectReason("");
      setSelectedInvoice(null);
      queryClient.invalidateQueries({ queryKey: ["approval"] });
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to reject payment");
    }
  };

  const openRejectDialog = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsRejectDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pending Payment Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve or reject payment slips
        </p>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by invoice or company..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Pending Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals ({data?.pagination.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending payment approvals
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Request No</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Slip</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customer.companyNameEn}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.customer.operatorFirstName} {invoice.customer.operatorLastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.testRequest.requestNo}</TableCell>
                    <TableCell>฿{invoice.netTotal.toLocaleString()}</TableCell>
                    <TableCell>
                      {invoice.paymentSlipAttachmentUrl ? (
                        <a
                          href={invoice.paymentSlipAttachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No slip</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(invoice.id)}
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(invoice)}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Pagination - Always visible */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {data?.data.length || 0} of {data?.pagination.total || 0} invoices
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {page} of {data?.pagination.totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (data?.pagination.totalPages || 1) || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment. The invoice will be reverted to pending status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedInvoice && (
              <div className="text-sm">
                <p>
                  <strong>Invoice:</strong> {selectedInvoice.invoiceNo}
                </p>
                <p>
                  <strong>Company:</strong> {selectedInvoice.customer.companyNameEn}
                </p>
              </div>
            )}
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectReason("");
                setSelectedInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejectMutation.isPending}
            >
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
