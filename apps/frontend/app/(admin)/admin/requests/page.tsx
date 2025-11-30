"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Search, Eye, Receipt } from "lucide-react";
import Link from "next/link";
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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { TestRequest, PaginatedResponse } from "@star-lab/shared";
import { PaymentStatusBadge, DocumentStatusBadge, LabStatusBadge } from "@/components/ui/badge";

export default function AdminRequestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["admin-requests", page, limit, debouncedSearch, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (status && status !== "ALL") params.append("status", status);
      
      const response = await apiClient.get<PaginatedResponse<TestRequest>>(`/test-requests?${params.toString()}`);
      return response.data;
    },
  });

  const requests = requestsData?.data;

  const handleViewDetails = (requestId: string) => {
    router.push(`/requests/${requestId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">All Test Requests</h1>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by request number or customer..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={status} onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
              <SelectItem value="RESULT_READY">Result Ready</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <CardContent>
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
                  <TableHead>Lab Status</TableHead>
                  <TableHead>Document Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto inline-block" /></TableCell>
                    </TableRow>
                  ))
                ) : requests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center h-24 text-muted-foreground">
                      No test requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.requestNo}</TableCell>
                      <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell>{request.requesterName}</TableCell>
                      <TableCell>{request.customer?.companyNameEn || 'N/A'}</TableCell>
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
                        <LabStatusBadge status={request.labInternalStatus} />
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="View Details"
                            onClick={() => handleViewDetails(request.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && requests && requests.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {requests.length} of {requestsData?.total || 0} requests
          </div>
          <Pagination
            currentPage={page}
            totalPages={requestsData?.totalPages || 1}
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
