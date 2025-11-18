"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, XCircle, FileText, Calendar, Building } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequestDetail, useApproveRequest, useRejectRequest } from "@/lib/hooks/useDoctor";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function DoctorRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const { data: request, isLoading } = useRequestDetail(requestId);
  const { approveRequest, isLoading: isApproving } = useApproveRequest();
  const { rejectRequest, isLoading: isRejecting } = useRejectRequest();

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    try {
      await approveRequest(requestId);
      alert("Request approved successfully");
      router.push("/doctor/pending-approvals");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to approve request");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      await rejectRequest({ id: requestId, reason: rejectionReason });
      alert("Request rejected successfully");
      router.push("/doctor/pending-approvals");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to reject request");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      DRAFT: { label: "Draft", variant: "outline" },
      SUBMITTED: { label: "Submitted", variant: "secondary" },
      APPROVED: { label: "Approved", variant: "default" },
      REJECTED: { label: "Rejected", variant: "destructive" },
      RESULT_READY: { label: "Ready for Review", variant: "secondary" },
    };

    const config = statusConfig[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-6">
        <Link href="/doctor/requests">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Request not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canApproveOrReject = request.documentStatus === "RESULT_READY";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/doctor/requests">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {request.requestNo || "N/A"}
              </h1>
              {getStatusBadge(request.documentStatus)}
            </div>
            <p className="text-muted-foreground">Test Request Details</p>
          </div>
        </div>
        {canApproveOrReject && !showRejectDialog && (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => setShowRejectDialog(true)}
              disabled={isRejecting}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Rejection Dialog */}
      {showRejectDialog && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Reject Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason for Rejection <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Provide a detailed reason for rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                }}
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting || !rejectionReason.trim()}
              >
                {isRejecting ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company Name (EN)</p>
              <p className="text-base">{request.customer?.companyNameEn || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company Name (TH)</p>
              <p className="text-base">{request.customer?.companyNameTh || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Requester Name</p>
              <p className="text-base">{request.requesterName || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Request Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Request Date</p>
              <p className="text-base">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(request.requestDate || Date.now()))}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-1">{getStatusBadge(request.documentStatus)}</div>
            </div>
            {request.approvedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved At</p>
                <p className="text-base">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(request.approvedAt))}
                </p>
              </div>
            )}
            {request.rejectedAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected At</p>
                <p className="text-base">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(request.rejectedAt))}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rejection Reason */}
      {request.rejectionReason && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Rejection Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{request.rejectionReason}</p>
          </CardContent>
        </Card>
      )}

      {/* Test Samples */}
      {request.testRequestSamples && request.testRequestSamples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Test Samples ({request.testRequestSamples.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {request.testRequestSamples.map((sample: any, index: number) => (
                <div key={sample.id || index} className="p-4 border rounded-lg">
                  <div className="grid gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Sample #{index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {sample.id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
