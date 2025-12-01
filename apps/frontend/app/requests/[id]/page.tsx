"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Building2, FlaskConical, User, Edit2, FileText, AlertCircle } from "lucide-react";
import { DoctorAssignmentDialog } from "@/components/request/DoctorAssignmentDialog";
import { useAuth } from "@/lib/context/AuthContext";
import type { TestRequestDocumentStatus } from "@star-lab/shared";
import { useRequest } from "@/lib/hooks/useRequest";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { RequestTimeline } from "@/components/request/RequestTimeline";

/**
 * Status Badge Component
 * Reusable component for displaying request status with color coding
 */
function StatusBadge({ status }: { status: TestRequestDocumentStatus }) {
  const statusConfig: Record<TestRequestDocumentStatus, { label: string; className: string }> = {
    DRAFT: {
      label: "Draft",
      className: "bg-gray-100 text-gray-700 border-gray-300",
    },
    SUBMITTED: {
      label: "Submitted",
      className: "bg-blue-100 text-blue-700 border-blue-300",
    },
    PENDING_PAYMENT: {
      label: "Pending Payment",
      className: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    RESULT_READY: {
      label: "Result Ready",
      className: "bg-purple-100 text-purple-700 border-purple-300",
    },
    APPROVED: {
      label: "Approved",
      className: "bg-green-100 text-green-700 border-green-300",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 border-red-300",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-gray-100 text-gray-700 border-gray-300",
    },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

/**
 * Request Detail Page
 * Displays full details of a single test request
 */
export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  const { user } = useAuth();
  const { data: request, isLoading, error } = useRequest(requestId);
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === "ADMIN" || user?.role === "LAB_ADMIN";

  // Format date helper
  const formatDate = (date?: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  // Generate invoice handler
  const handleGenerateInvoice = async () => {
    try {
      setIsGenerating(true);
      await apiClient.post(`/invoices/test-request/${requestId}`);
      // Refresh request data to show new invoice
      queryClient.invalidateQueries({ queryKey: ["request", requestId] });
      toast.success("Invoice generated successfully");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // Error state
  if (error || !request) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Request Not Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error ? "There was an error loading this request." : "This request doesn&apos;t exist or you don&apos;t have access to it."}
            </p>
            <Link href="/requests">
              <Button>Back to Requests</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight">{request.requestNo}</h1>
            <p className="text-muted-foreground">Test Request Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(request.documentStatus === "DRAFT" || isAdmin) && (
            <Link href={`/requests/${request.id}/edit`}>
              <Button>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Request
              </Button>
            </Link>
          )}
          {request.invoices && request.invoices.length > 0 && (
            <Link href={`/invoices/${request.invoices[0].id}`}>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Invoice
              </Button>
            </Link>
          )}
          {isAdmin && (!request.invoices || request.invoices.length === 0) && (
            <Button 
              variant="outline" 
              onClick={handleGenerateInvoice}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Invoice"}
            </Button>
          )}
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Status</CardTitle>
              <CardDescription>Current request status</CardDescription>
            </div>
            <StatusBadge status={request.documentStatus} />
          </div>
        </CardHeader>
      </Card>

      {/* Doctor Assignment Card (Admin Only) */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Doctor Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Assigned Doctor</span>
                <span className="font-medium">
                  {(request as any).doctor?.user?.userProfile
                    ? `${(request as any).doctor.user.userProfile.firstName} ${(request as any).doctor.user.userProfile.lastName}`
                    : "Not Assigned"}
                </span>
              </div>
              <div className="flex justify-end">
                <DoctorAssignmentDialog
                  requestId={request.id}
                  currentDoctorId={(request as any).doctorId}
                  onSuccess={() => {
                    // Refetch is handled by query invalidation
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Request Number</label>
              <p className="text-base font-medium mt-1">{request.requestNo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Request Date</label>
              <p className="text-base mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(request.requestDate)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Requester Name</label>
              <p className="text-base mt-1 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {request.requesterName || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <p className="text-base mt-1 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {request.customer?.companyNameEn || "-"}
              </p>
            </div>
          </div>

          {request.objective && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Objective</label>
              <p className="text-base mt-1">{request.objective}</p>
            </div>
          )}

          {request.project && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project</label>
              <p className="text-base mt-1">{request.project.name || "-"}</p>
            </div>
          )}

          {request.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
              <p className="text-base mt-1 whitespace-pre-wrap">{request.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Samples */}
      <Card>
        <CardHeader>
          <CardTitle>Samples</CardTitle>
          <CardDescription>
            {request.testRequestSamples?.length || 0} sample(s) in this request
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!request.testRequestSamples || request.testRequestSamples.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No samples added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {request.testRequestSamples.map((sample, index) => (
                <Card key={sample.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Sample #{index + 1}</h4>
                      <Badge variant="outline">{sample.customerSampleId}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="text-muted-foreground">Sent Sample Date</label>
                        <p className="font-medium">{formatDate(sample.sentSampleDate)}</p>
                      </div>
                      {sample.animalType && (
                        <div>
                          <label className="text-muted-foreground">Animal Type</label>
                          <p className="font-medium">{sample.animalType}</p>
                        </div>
                      )}
                      {sample.sampleSpecimen && (
                        <div>
                          <label className="text-muted-foreground">Sample Specimen</label>
                          <p className="font-medium">{sample.sampleSpecimen}</p>
                        </div>
                      )}
                      {sample.panel && (
                        <div>
                          <label className="text-muted-foreground">Panel</label>
                          <p className="font-medium">{sample.panel}</p>
                        </div>
                      )}
                      {sample.method && (
                        <div>
                          <label className="text-muted-foreground">Method</label>
                          <p className="font-medium">{sample.method}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-muted-foreground">Requested Quantity</label>
                        <p className="font-medium">
                          {sample.requestedQty} {sample.unit || "samples"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Status Timeline</CardTitle>
          <CardDescription>Track your request progress</CardDescription>
        </CardHeader>
        <CardContent>
          <RequestTimeline request={request} />
        </CardContent>
      </Card>
    </div>
  );
}
