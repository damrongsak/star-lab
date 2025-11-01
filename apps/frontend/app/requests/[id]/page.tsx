"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit2, FileText, Calendar, User, Building2 } from "lucide-react";
import type { TestRequest, TestRequestDocumentStatus } from "@star-lab/shared";

/**
 * Status Badge Component
 * Reusable component for displaying request status with color coding
 */
function StatusBadge({ status }: { status: TestRequestDocumentStatus }) {
  const statusConfig = {
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
 * Mock data - same as in requests/page.tsx
 */
const mockCustomer = {
  id: "customer-1",
  userId: "user-1",
  companyName: "ABC Company",
  taxIdOrIdCard: "123456789",
  addressLine1: "123 Main St",
  city: "Bangkok",
  country: "Thailand",
  shippingAddressLine1: "123 Main St",
  shippingCity: "Bangkok",
  shippingCountry: "Thailand",
  registrationStatus: "APPROVED" as const,
  isActive: true,
  createdAt: new Date("2025-10-01"),
  updatedAt: new Date("2025-10-01"),
} as any;

const mockRequests: TestRequest[] = [
  {
    id: "1",
    requestNo: "ABC-20251031-001",
    customerId: "customer-1",
    requesterName: "John Doe",
    objective: "Quality testing for new product line",
    requestDate: new Date("2025-10-31"),
    documentStatus: "DRAFT",
    labInternalStatus: "WAITING_APPROVAL_LAB",
    notes: "Sample request for testing. Please expedite.",
    createdAt: new Date("2025-10-31"),
    updatedAt: new Date("2025-10-31"),
    testRequestSamples: [
      {
        id: "sample-1",
        testRequestId: "1",
        customerSampleId: "SAMP-001",
        sentSampleDate: new Date("2025-10-30"),
        animalType: "Dog",
        sampleSpecimen: "Blood",
        panel: "Complete Blood Count",
        method: "Hematology Analyzer",
        requestedQty: 2,
        unit: "tubes",
        currentStatus: "PENDING",
      } as any,
      {
        id: "sample-2",
        testRequestId: "1",
        customerSampleId: "SAMP-002",
        sentSampleDate: new Date("2025-10-30"),
        animalType: "Cat",
        sampleSpecimen: "Tissue",
        panel: "Histopathology",
        requestedQty: 1,
        unit: "sample",
        currentStatus: "PENDING",
      } as any,
    ],
    customer: mockCustomer,
  },
  {
    id: "2",
    requestNo: "ABC-20251030-005",
    customerId: "customer-1",
    requesterName: "Jane Smith",
    objective: "Routine health screening",
    requestDate: new Date("2025-10-30"),
    documentStatus: "SUBMITTED",
    labInternalStatus: "RECEIVED_SAMPLES",
    createdAt: new Date("2025-10-30"),
    updatedAt: new Date("2025-10-31"),
    testRequestSamples: [
      {
        id: "sample-3",
        testRequestId: "2",
        customerSampleId: "SAMP-003",
        animalType: "Dog",
        sampleSpecimen: "Blood",
        requestedQty: 1,
        unit: "sample",
        currentStatus: "RECEIVED",
      } as any,
    ],
    customer: mockCustomer,
  },
  {
    id: "3",
    requestNo: "ABC-20251029-003",
    customerId: "customer-1",
    requesterName: "Bob Wilson",
    requestDate: new Date("2025-10-29"),
    documentStatus: "PENDING_PAYMENT",
    labInternalStatus: "READY_FOR_APPROVAL",
    createdAt: new Date("2025-10-29"),
    updatedAt: new Date("2025-10-30"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
  {
    id: "4",
    requestNo: "ABC-20251028-002",
    customerId: "customer-1",
    requesterName: "Alice Brown",
    requestDate: new Date("2025-10-28"),
    documentStatus: "APPROVED",
    labInternalStatus: "COMPLETED",
    createdAt: new Date("2025-10-28"),
    updatedAt: new Date("2025-10-29"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
  {
    id: "5",
    requestNo: "ABC-20251027-004",
    customerId: "customer-1",
    requesterName: "Charlie Davis",
    requestDate: new Date("2025-10-27"),
    documentStatus: "REJECTED",
    labInternalStatus: "HOLD",
    notes: "Insufficient sample quantity. Please resubmit.",
    createdAt: new Date("2025-10-27"),
    updatedAt: new Date("2025-10-28"),
    testRequestSamples: [],
    customer: mockCustomer,
  },
];

/**
 * Request Detail Page
 * Displays full details of a test request including samples
 */
export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  const [request, setRequest] = useState<TestRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundRequest = mockRequests.find((r) => r.id === requestId);
      setRequest(foundRequest || null);
      setIsLoading(false);
    }, 500);
  }, [requestId]);

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
        <Button variant="ghost" onClick={() => router.push("/requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Request Not Found</h3>
            <p className="text-sm text-muted-foreground">
              The request you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isDraft = request.documentStatus === "DRAFT";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/requests")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{request.requestNo}</h1>
            <p className="text-muted-foreground">Test Request Details</p>
          </div>
        </div>
        {isDraft && (
          <Link href={`/requests/${request.id}/edit`}>
            <Button>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Request
            </Button>
          </Link>
        )}
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Request Status</CardTitle>
            <StatusBadge status={request.documentStatus} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Submitted Date</p>
                <p className="text-sm text-muted-foreground">
                  {request.requestDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Requester</p>
                <p className="text-sm text-muted-foreground">{request.requesterName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Company</p>
                <p className="text-sm text-muted-foreground">
                  {request.customer.companyName}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Lab Status</p>
                <p className="text-sm text-muted-foreground">
                  {request.labInternalStatus.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Request Number</p>
            <p className="text-sm text-muted-foreground">{request.requestNo}</p>
          </div>
          {request.objective && (
            <div>
              <p className="text-sm font-medium mb-1">Objective</p>
              <p className="text-sm text-muted-foreground">{request.objective}</p>
            </div>
          )}
          {request.notes && (
            <div>
              <p className="text-sm font-medium mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">{request.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Samples */}
      <Card>
        <CardHeader>
          <CardTitle>Samples ({request.testRequestSamples?.length || 0})</CardTitle>
          <CardDescription>
            List of all samples included in this test request
          </CardDescription>
        </CardHeader>
        <CardContent>
          {request.testRequestSamples && request.testRequestSamples.length > 0 ? (
            <div className="space-y-3">
              {request.testRequestSamples.map((sample, index) => (
                <div key={sample.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{sample.customerSampleId}</p>
                        <Badge variant="outline" className="text-xs">
                          {sample.currentStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="font-medium">Quantity:</span>{" "}
                          <span className="text-muted-foreground">
                            {sample.requestedQty} {sample.unit || "samples"}
                          </span>
                        </div>
                        {sample.sentSampleDate && (
                          <div>
                            <span className="font-medium">Sent Date:</span>{" "}
                            <span className="text-muted-foreground">
                              {new Date(sample.sentSampleDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {sample.animalType && (
                          <div>
                            <span className="font-medium">Animal:</span>{" "}
                            <span className="text-muted-foreground">
                              {sample.animalType}
                            </span>
                          </div>
                        )}
                        {sample.sampleSpecimen && (
                          <div>
                            <span className="font-medium">Specimen:</span>{" "}
                            <span className="text-muted-foreground">
                              {sample.sampleSpecimen}
                            </span>
                          </div>
                        )}
                        {sample.panel && (
                          <div>
                            <span className="font-medium">Panel:</span>{" "}
                            <span className="text-muted-foreground">{sample.panel}</span>
                          </div>
                        )}
                        {sample.method && (
                          <div>
                            <span className="font-medium">Method:</span>{" "}
                            <span className="text-muted-foreground">{sample.method}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No samples added yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline / History - Optional future enhancement */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="rounded-full bg-primary h-2 w-2 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Request Updated</p>
                <p className="text-xs text-muted-foreground">
                  {request.updatedAt.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="rounded-full bg-muted h-2 w-2 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium">Request Created</p>
                <p className="text-xs text-muted-foreground">
                  {request.createdAt.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
