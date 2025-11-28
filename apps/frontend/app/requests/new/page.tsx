"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import {
  TestRequestForm,
  formSchema,
  type FormValues,
} from "../_components/TestRequestForm";
import type { CreateRequestData } from "@/lib/hooks/useRequest";

export default function NewRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (status: "DRAFT" | "SUBMITTED") => {
    const formData = form.getValues();

    const payload: CreateRequestData = {
      requesterName: formData.requesterName,
      objective: formData.objective || undefined,
      project: formData.project && formData.project !== "none" ? formData.project : undefined,
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
      setIsSubmitting(true);
      await apiClient.post("/test-requests", payload);

      if (status === "DRAFT") {
        toast.success("Request saved as draft");
      } else {
        toast.success("Request submitted successfully");
      }

      router.push("/requests");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Test Request</h1>
        <p className="text-muted-foreground">
          Fill out the form to submit a new laboratory test request
        </p>
      </div>

      <TestRequestForm
        form={form}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Submit Request"
      />
    </div>
  );
}
