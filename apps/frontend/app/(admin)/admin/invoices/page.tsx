"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Search, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Invoice } from "@star-lab/shared";

const paymentStatusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PAID: "default",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
  REFUNDED: "secondary",
};

export default function AdminInvoicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ["admin-invoices", statusFilter, debouncedSearch, page, limit],
    queryFn: async () => {
      const params: any = { page, limit };
      if (statusFilter !== "all") params.paymentStatus = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      
      const response = await apiClient.get<{ data: Invoice[], pagination: { total: number, totalPages: number, page: number } }>("/invoices", { params });
      return response.data;
    },
  });

  const invoices = invoicesData?.data;

  const handleViewDetails = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">All Invoices</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number or customer..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto inline-block" /></TableCell>
                    </TableRow>
                  ))
                ) : invoices?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices?.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                      <TableCell>{invoice.customer?.companyNameEn || 'N/A'}</TableCell>
                      <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.netTotal)}</TableCell>
                      <TableCell>
                        <Badge variant={paymentStatusColors[invoice.paymentStatus] || "default"}>
                          {invoice.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="View Details"
                            onClick={() => handleViewDetails(invoice.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {invoices?.length || 0} of {invoicesData?.pagination.total || 0} invoices
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {page} of {invoicesData?.pagination.totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(invoicesData?.pagination.totalPages || 1, p + 1))}
                disabled={page === (invoicesData?.pagination.totalPages || 1) || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
