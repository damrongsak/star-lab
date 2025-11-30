"use client";

import { useParams } from "next/navigation";
import { useLabRequest } from "@/lib/hooks/useLab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, Calendar, Building2, FlaskConical } from "lucide-react";
import { TechnicianAssignmentDialog } from "./TechnicianAssignmentDialog";

export default function LabRequestDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: request, isLoading } = useLabRequest(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 bg-secondary/50" />
        <Skeleton className="h-96 w-full bg-secondary/50" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FlaskConical className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Request Not Found</h2>
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
      SAMPLE_RECEIVED: "bg-blue-400/10 text-blue-400 border-blue-400/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      COMPLETED: "bg-accent/10 text-accent border-accent/20",
      APPROVED: "bg-green-400/10 text-green-400 border-green-400/20",
      REJECTED: "bg-red-400/10 text-red-400 border-red-400/20",
    };
    return statusMap[status] || "bg-secondary text-muted-foreground border-border";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/lab/requests">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Request {request.requestNo}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage test request details
          </p>
        </div>
        <Badge variant="outline" className={getStatusBadge(request.status || 'PENDING')}>
          {(request.status || 'PENDING').replace('_', ' ')}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Request Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card className="border-border bg-card/50">
            <CardHeader className="border-b border-border bg-secondary/30">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Company Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {request.customer?.companyNameEn || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Request Number</p>
                  <p className="text-sm font-mono font-medium text-foreground">
                    {request.requestNo}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Contact Person</p>
                  <p className="text-sm font-medium text-foreground">
                    {request.customer?.contactPersonName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Contact Email</p>
                  <p className="text-sm font-medium text-foreground">
                    {request.customer?.contactEmail || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Samples & Tests */}
          <Card className="border-border bg-card/50">
            <CardHeader className="border-b border-border bg-secondary/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-accent" />
                  Samples & Lab Tests
                </CardTitle>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  {request.testRequestSamples?.length || 0} Samples
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {request.testRequestSamples && request.testRequestSamples.length > 0 ? (
                <div className="divide-y divide-border">
                  {request.testRequestSamples.map((sample: any) => (
                    <div key={sample.id} className="p-6 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-mono font-semibold text-foreground">
                            {sample.customerSampleId}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {sample.sampleType || 'Sample Type Not Specified'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {sample.labTests?.length || 0} Tests
                        </Badge>
                      </div>
                      
                      {sample.labTests && sample.labTests.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {sample.labTests.map((test: any) => (
                            <div 
                              key={test.id} 
                              className="flex items-center justify-between p-2 rounded bg-secondary/30"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm text-foreground">{test.testPanel || 'Test Panel'}</span>
                                {test.assignedLabTechnician && (
                                  <span className="text-xs text-muted-foreground">
                                    Assigned: {test.assignedLabTechnician.firstName} {test.assignedLabTechnician.lastName}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={getStatusBadge(test.labResultStatus || 'PENDING')}
                                >
                                  {(test.labResultStatus || 'PENDING').replace('_', ' ')}
                                </Badge>
                                <TechnicianAssignmentDialog labTest={test} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FlaskConical className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No samples assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Metadata */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border bg-card/50">
            <CardHeader className="border-b border-border bg-secondary/30">
              <CardTitle className="text-base font-bold">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {request.status === 'PENDING' && (
                <Link href={`/lab/requests/${id}/acknowledge`}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Acknowledge Samples
                  </Button>
                </Link>
              )}
              <Link href={`/lab/requests/${id}/results`}>
                <Button variant="outline" className="w-full border-border hover:bg-secondary/50">
                  View/Enter Results
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="border-border bg-card/50">
            <CardHeader className="border-b border-border bg-secondary/30">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Created</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Last Updated</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(request.updatedAt).toLocaleString()}
                </p>
              </div>
              {request.sampleReceivedAt && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Sample Received</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(request.sampleReceivedAt).toLocaleString()}
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
