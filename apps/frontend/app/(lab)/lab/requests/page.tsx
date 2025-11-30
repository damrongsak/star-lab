"use client";

import { useState } from "react";
import { useLabRequests } from "@/lib/hooks/useLab";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import Link from "next/link";
import { Eye, FlaskConical, Receipt, Search } from "lucide-react";
import { TestRequest, PaginatedResponse } from "@star-lab/shared";
import { PaymentStatusBadge, LabStatusBadge } from "@/components/ui/badge";

export default function LabRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading } = useLabRequests(
    {
      status: statusFilter === "ALL" ? undefined : statusFilter,
      search: searchQuery,
      page,
      limit,
    }
  ) as { data: PaginatedResponse<TestRequest> | undefined, isLoading: boolean };
  
  const requests = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Requests</h1>
          <p className="text-muted-foreground">
            Manage incoming test requests and samples.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Request No or Company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="WAITING_APPROVAL_LAB">Waiting Approval</SelectItem>
              <SelectItem value="RECEIVED_SAMPLES">Received Samples</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESULTS_UPLOADED">Results Uploaded</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Samples</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Lab Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests?.map((request: TestRequest) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.requestNo}
                      </TableCell>
                      <TableCell>{request.customer?.companyNameEn || request.customer?.companyNameTh || "-"}</TableCell>
                      <TableCell>
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </TableCell>
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
                        <LabStatusBadge status={request.labInternalStatus || request.documentStatus || "UNKNOWN"} />
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
                          {(request.labInternalStatus === "WAITING_APPROVAL_LAB" || request.documentStatus === "SUBMITTED") && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/lab/requests/${request.id}/acknowledge`}>
                                <FlaskConical className="mr-2 h-4 w-4" />
                                Acknowledge
                              </Link>
                            </Button>
                          )}
                          {(request.labInternalStatus === "RECEIVED_SAMPLES" || request.labInternalStatus === "IN_PROGRESS" || request.labInternalStatus === "ASSIGNED_TECHNICIAN") && (
                             <Button size="sm" variant="outline" asChild>
                              <Link href={`/lab/requests/${request.id}/results`}>
                                <FlaskConical className="mr-2 h-4 w-4" />
                                Results
                              </Link>
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/requests/${request.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && requests && requests.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {requests.length} of {data?.total || 0} requests
          </div>
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages || 1}
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
