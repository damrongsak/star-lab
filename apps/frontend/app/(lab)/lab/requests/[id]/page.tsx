"use client";

import { useParams, useRouter } from "next/navigation";
import { useLabRequest } from "@/lib/hooks/useLab";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LabStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Building2, 
  FlaskConical, 
  User, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Package
} from "lucide-react";
import { TechnicianAssignmentDialog } from "./TechnicianAssignmentDialog";

export default function LabRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: request, isLoading } = useLabRequest(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FlaskConical className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Request Not Found</h2>
        <p className="text-muted-foreground mb-6">The lab request you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/lab/requests">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canAcknowledge = request.labInternalStatus === "WAITING_APPROVAL_LAB";
  const canEnterResults = ["RECEIVED_SAMPLES", "ASSIGNED_TECHNICIAN", "IN_PROGRESS"].includes(
    request.labInternalStatus || ""
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {request.requestNo}
            </h1>
            <p className="text-muted-foreground mt-1">
              Lab Request Details & Management
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <LabStatusBadge status={request.labInternalStatus || 'WAITING_APPROVAL_LAB'} />
          {request.documentStatus && (
            <Badge variant="outline">
              Doc: {request.documentStatus}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Request Info & Samples */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Request Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Request Number</label>
                  <p className="text-sm font-mono mt-1">{request.requestNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Request Date</label>
                  <p className="text-sm mt-1">{formatDate(request.requestDate || request.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Requester Name</label>
                  <p className="text-sm mt-1">{request.requesterName || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company</label>
                  <p className="text-sm mt-1">{request.customer?.companyNameEn || "-"}</p>
                </div>
              </div>
              
              {request.objective && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Objective</label>
                  <p className="text-sm mt-1">{request.objective}</p>
                </div>
              )}
              
              {request.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{request.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Samples & Lab Tests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Samples & Lab Tests
                </CardTitle>
                <Badge variant="outline">
                  {request.testRequestSamples?.length || 0} Sample(s)
                </Badge>
              </div>
              <CardDescription>
                Manage sample status and assign technicians to tests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {request.testRequestSamples && request.testRequestSamples.length > 0 ? (
                <div className="divide-y">
                  {request.testRequestSamples.map((sample: any, index: number) => (
                    <div key={sample.id} className="p-6 space-y-4">
                      {/* Sample Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Sample #{index + 1}</h3>
                            <Badge variant="outline" className="text-xs">
                              {sample.customerSampleId}
                            </Badge>
                          </div>
                          {sample.currentStatus && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {sample.currentStatus.replace(/_/g, ' ')}
                            </Badge>
                          )}
                        </div>
                        {sample.labTests && (
                          <Badge variant="secondary">
                            {sample.labTests.length} Test(s)
                          </Badge>
                        )}
                      </div>

                      {/* Sample Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {sample.sentSampleDate && (
                          <div>
                            <label className="text-muted-foreground">Sent Date</label>
                            <p className="font-medium">{formatDate(sample.sentSampleDate)}</p>
                          </div>
                        )}
                        {sample.animalType && (
                          <div>
                            <label className="text-muted-foreground">Animal Type</label>
                            <p className="font-medium">{sample.animalType}</p>
                          </div>
                        )}
                        {sample.sampleSpecimen && (
                          <div>
                            <label className="text-muted-foreground">Specimen</label>
                            <p className="font-medium">{sample.sampleSpecimen}</p>
                          </div>
                        )}
                        {sample.requestedQty && (
                          <div>
                            <label className="text-muted-foreground">Quantity</label>
                            <p className="font-medium">
                              {sample.requestedQty} {sample.unit || ""}
                            </p>
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
                      </div>

                      {/* Lab Tests */}
                      {sample.labTests && sample.labTests.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <Separator />
                          <label className="text-sm font-medium">Lab Tests</label>
                          <div className="space-y-2">
                            {sample.labTests.map((test: any) => (
                              <div
                                key={test.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{test.testPanel || "Test Panel"}</p>
                                  {test.assignedLabTechnician?.userProfile && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      <User className="inline h-3 w-3 mr-1" />
                                      Assigned: {test.assignedLabTechnician.userProfile.firstName}{" "}
                                      {test.assignedLabTechnician.userProfile.lastName}
                                    </p>
                                  )}
                                  {test.caseNo && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Case: {test.caseNo}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <LabStatusBadge status={test.labResultStatus || "PENDING"} />
                                  <TechnicianAssignmentDialog labTest={test} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No samples assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Metadata */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canAcknowledge && (
                <Link href={`/lab/requests/${id}/acknowledge`}>
                  <Button className="w-full" size="sm">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Acknowledge Samples
                  </Button>
                </Link>
              )}
              {canEnterResults && (
                <Link href={`/lab/requests/${id}/results`}>
                  <Button variant="outline" className="w-full" size="sm">
                    <FlaskConical className="mr-2 h-4 w-4" />
                    Enter/View Results
                  </Button>
                </Link>
              )}
              <Link href={`/requests/${id}`}>
                <Button variant="outline" className="w-full" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Request
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
                
                {request.sampleReceivedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Samples Received</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(request.sampleReceivedAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(request.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Customer Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Company</label>
                <p className="text-sm font-medium mt-1">
                  {request.customer?.companyNameEn || "-"}
                </p>
              </div>
              {request.customer?.user?.email && (
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <p className="text-sm font-medium mt-1">
                    {request.customer.user.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
