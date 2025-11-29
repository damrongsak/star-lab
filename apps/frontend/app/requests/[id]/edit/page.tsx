"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TestRequestForm, formSchema, type FormValues } from "../../../../components/request/TestRequestForm";
import { useRequest, useUpdateRequest, type UpdateRequestData } from "@/lib/hooks/useRequest";

function formatDateInput(value?: string | Date | null) {
  if (!value) return undefined;
  const date = typeof value === "string" ? value : value.toISOString();
  return date.split("T")[0];
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
  } = useRequest(requestId, !!requestId);
  const updateRequest = useUpdateRequest();
  const nonDraftRedirectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShownStatusErrorRef = useRef(false);

  const canEdit = request?.documentStatus === "DRAFT";

  useEffect(() => {
    if (!request) return;

    if (!canEdit) {
      if (!hasShownStatusErrorRef.current) {
        hasShownStatusErrorRef.current = true;
        toast.error("Only draft requests can be edited");
      }

      if (!nonDraftRedirectRef.current) {
        nonDraftRedirectRef.current = setTimeout(() => {
          router.replace(`/requests/${request.id}`);
        }, 1500);
      }
      return () => {
        if (nonDraftRedirectRef.current) {
          clearTimeout(nonDraftRedirectRef.current);
          nonDraftRedirectRef.current = null;
        }
      };
    }

    hasShownStatusErrorRef.current = false;
    if (nonDraftRedirectRef.current) {
      clearTimeout(nonDraftRedirectRef.current);
      nonDraftRedirectRef.current = null;
    }

    const mappedValues: FormValues = {
      requesterName: request.requesterName || "",
      objective: request.objective || "",
      project: request.projectId || request.project?.id || request.project?.name || "none",
      notes: request.notes || "",
      samples:
        request.testRequestSamples?.map((sample) => ({
          customerSampleId: sample.customerSampleId,
          sentSampleDate: formatDateInput(sample.sentSampleDate ?? undefined),
          animalType: sample.animalType || undefined,
          sampleSpecimen: sample.sampleSpecimen || undefined,
          panel: sample.panel || undefined,
          method: sample.method || undefined,
          requestedQty: sample.requestedQty,
          unit: sample.unit || "samples",
        })) || [],
    };

    form.reset(mappedValues);
  }, [request, canEdit, form, router]);

  const handleSubmit = async (status: "DRAFT" | "SUBMITTED") => {
    const values = form.getValues();
    if (!request) return;

    const payload: UpdateRequestData = {
      id: request.id,
      requesterName: values.requesterName,
      objective: values.objective || undefined,
      projectId: values.project && values.project !== "none" ? values.project : undefined,
      notes: values.notes || undefined,
      documentStatus: status,
      samples: values.samples.map((sample) => ({
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
      await updateRequest.mutateAsync(payload);
      router.push(`/requests/${request.id}`);
    } catch {
      // Errors are handled inside the mutation hook via toast
    }
  };

  const loadingState = (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-[600px] w-full" />
    </div>
  );

  const errorMessage = useMemo(() => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
      return error.message;
    }
    return "This request couldn't be found or loaded.";
  }, [error]);

  if (isLoading) {
    return loadingState;
  }

  if (error || !request) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <CardTitle>Request Not Found</CardTitle>
                <CardDescription>The requested record could not be located.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{errorMessage || "Please verify the link and try again."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href={`/requests/${request.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Request
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <CardTitle>Request Cannot Be Edited</CardTitle>
                <CardDescription>Only draft requests can be updated.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You will be redirected to the request details shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" className="w-fit" asChild>
          <Link href={`/requests/${request.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Request
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Test Request</h1>
          <p className="text-muted-foreground">Update the information for this draft request.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Modify the draft information and resubmit when ready.</CardDescription>
        </CardHeader>
        <CardContent>
          <TestRequestForm
            form={form}
            onSubmit={handleSubmit}
            isSubmitting={updateRequest.isPending}
            submitLabel="Submit Updates"
          />
        </CardContent>
      </Card>
    </div>
  );
}
