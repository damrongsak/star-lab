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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Eye, FlaskConical } from "lucide-react";


export default function LabRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useLabRequests({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: searchQuery,
  });
  
  const requests = data?.testRequests || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING_APPROVAL_LAB":
      case "SUBMITTED":
        return "bg-blue-500";
      case "RECEIVED_SAMPLES":
      case "RECEIVED":
        return "bg-yellow-500";
      case "IN_PROGRESS":
      case "ASSIGNED_TECHNICIAN":
        return "bg-purple-500";
      case "RESULTS_UPLOADED":
      case "RESULT_READY":
        return "bg-indigo-500";
      case "COMPLETED":
      case "APPROVED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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

      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Input
              placeholder="Search by Request No or Company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
        </CardHeader>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Samples</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests?.map((request: any) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.requestNo}
                      </TableCell>
                      <TableCell>{request.Customer?.companyName}</TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.labInternalStatus || request.documentStatus)}>
                          {(request.labInternalStatus || request.documentStatus || "UNKNOWN").replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.testRequestSamples?.length || request.samples?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
    </div>
  );
}
