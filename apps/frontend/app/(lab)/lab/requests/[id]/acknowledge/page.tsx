"use client";

import { useLabRequest, useAcknowledgeSample } from "@/lib/hooks/useLab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function AcknowledgeSamplesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: request, isLoading } = useLabRequest(id);
  const acknowledgeMutation = useAcknowledgeSample();

  const handleAcknowledge = () => {
    acknowledgeMutation.mutate(
      { requestId: id },
      {
        onSuccess: () => {
          router.push("/lab/requests");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/lab/requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Acknowledge Samples</h1>
          <p className="text-muted-foreground">
            Verify and acknowledge receipt of physical samples.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Request No</div>
                <div className="text-lg font-bold">{request.requestNo}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Customer</div>
                <div>{request.Customer?.companyName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Project Name</div>
                <div>{request.projectName || "-"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Contact Person</div>
                <div>{request.Customer?.contactPerson}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Samples Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.samples?.map((sample: any, index: number) => (
                  <div
                    key={sample.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{sample.sampleId}</div>
                        <div className="text-sm text-muted-foreground">
                          {sample.sampleType}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Pending Receipt</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                By acknowledging, you confirm that all physical samples listed have been received in good condition and match the request details.
              </p>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleAcknowledge}
                disabled={acknowledgeMutation.isPending}
              >
                {acknowledgeMutation.isPending ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Acknowledge Receipt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
