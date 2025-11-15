"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import {
  TestRequestForm,
  formSchema,
  type FormValues,
} from "../../_components/TestRequestForm";
import { useRequest, useUpdateRequest } from "@/lib/hooks/useRequest";

function formatDateInput(value?: Date) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

export default function EditRequestPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requesterName: "",
      objective: "",
      project: "none",
      notes: "",
      samples: [],
    },
  });

  const {
    data: request,
    isLoading,
    error,
  } = useRequest(requestId, Boolean(requestId));
  const updateMutation = useUpdateRequest();

  useEffect(() => {
    if (!request) return;

    form.reset({
      requesterName: request.requesterName ?? "",
      objective: request.objective ?? "",
      project:
        request.project?.id ??
        request.project?.name ??
        "none",
      notes: request.notes ?? "",
      samples:
        request.testRequestSamples?.map((sample) => ({
          customerSampleId: sample.customerSampleId ?? "",
          sentSampleDate: formatDateInput(sample.sentSampleDate),
          animalType: sample.animalType ?? undefined,
          sampleSpecimen: sample.sampleSpecimen ?? undefined,
          panel: sample.panel ?? undefined,
          method: sample.method ?? undefined,
          requestedQty: sample.requestedQty ?? 1,
          unit: sample.unit ?? "samples",
        })) ?? [],
    });
  }, [request, form]);

  const handleSubmit = async (status: "DRAFT" | "SUBMITTED") => {
    if (!requestId) return;
    const formData = form.getValues();

    const payload = {
      id: requestId,
      requesterName: formData.requesterName,
      objective: formData.objective || undefined,
      project:
        formData.project && formData.project !== "none"
          ? formData.project
          : undefined,
      notes: formData.notes || undefined,
      documentStatus: status,
      samples: formData.samples.map((sample) => ({
        customerSampleId: sample.customerSampleId,
        sentSampleDate: sample.sentSampleDate || undefined,
        animalType: sample.animalType || undefined,
        sampleSpecimen: sample.sampleSpecimen || undefined,
        panel: sample.panel || undefined,
        method: sample.method || undefined,
        requestedQty: sample.requestedQty,
        unit: sample.unit || "samples",
      })),
    };

    try {
      await updateMutation.mutateAsync(payload);
      router.push(`/requests/${requestId}`);
    } catch {
      // Errors are handled via mutation onError toast
    }
  };

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

  if (error || !request) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
            <h2 className="text-lg font-semibold mb-2">
              Unable to load request
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {error
                ? "There was an error loading this request. Please try again later."
                : "This request could not be found or you do not have permission to edit it."}
            </p>
            <Link href="/requests">
              <Button>Back to Requests</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (request.documentStatus !== "DRAFT") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {request.requestNo}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editing Disabled</CardTitle>
            <CardDescription>
              This test request can no longer be modified.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>
              Requests can only be edited while they are in the DRAFT status.
            </span>
          </CardContent>
        </Card>

        <Link href={`/requests/${request.id}`}>
          <Button>View Request Details</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit {request.requestNo}
            </h1>
            <p className="text-muted-foreground">
              Update the details of your test request
            </p>
          </div>
        </div>
        <Link href={`/requests/${request.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
      </div>

      <TestRequestForm
        form={form}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Submit Updates"
      />
    </div>
  );
}
