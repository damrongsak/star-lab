"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Plus, Trash2, Check, Edit2 } from "lucide-react";
import { toast } from "sonner";
import type { TestRequestSample } from "@star-lab/shared";

/**
 * Form validation schema using Zod
 */
const sampleSchema = z.object({
  customerSampleId: z.string().min(1, "Sample ID is required"),
  sentSampleDate: z.string().optional(),
  animalType: z.string().optional(),
  sampleSpecimen: z.string().optional(),
  panel: z.string().optional(),
  method: z.string().optional(),
  requestedQty: z.coerce.number().min(1, "Quantity must be at least 1"),
  unit: z.string(),
});

const formSchema = z.object({
  requesterName: z.string().min(2, "Requester name must be at least 2 characters"),
  objective: z.string().optional(),
  project: z.string().optional(),
  notes: z.string().optional(),
  samples: z.array(sampleSchema).min(1, "At least one sample is required"),
});

type FormValues = z.output<typeof formSchema>;

/**
 * Stepper Component
 * Displays the current step and progress
 */
function Stepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Basic Information" },
    { number: 2, label: "Add Samples" },
    { number: 3, label: "Review & Submit" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
                  currentStep === step.number
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep > step.number
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep === step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-1 flex-1 rounded ${
                  currentStep > step.number ? "bg-green-500" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Step 1: Basic Information Form
 */
function BasicInfoStep({
  form,
  onNext,
}: {
  form: any;
  onNext: () => void;
}) {
  const { register, control, formState: { errors } } = form;

  const handleNext = async () => {
    const isValid = await form.trigger(["requesterName", "objective", "project", "notes"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter the basic details for this test request
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="requestNo">Request Number</Label>
          <Input
            id="requestNo"
            placeholder="Will be generated automatically"
            disabled
          />
          <p className="text-xs text-muted-foreground">
            Request number will be assigned when you submit
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requesterName">
            Requester Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="requesterName"
            {...register("requesterName")}
            placeholder="Enter requester name"
          />
          {errors.requesterName && (
            <p className="text-xs text-destructive">{errors.requesterName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="objective">Objective</Label>
          <Textarea
            id="objective"
            {...register("objective")}
            placeholder="Enter the objective of this test request"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project">Project</Label>
          <Controller
            name="project"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="project-a">Project A</SelectItem>
                  <SelectItem value="project-b">Project B</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Add any additional notes"
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Step 2: Add Samples Form
 */
function SamplesStep({
  form,
  onBack,
  onNext,
}: {
  form: any;
  onBack: () => void;
  onNext: () => void;
}) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "samples",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentSample, setCurrentSample] = useState<Partial<z.infer<typeof sampleSchema>>>({
    requestedQty: 1,
    unit: "samples",
  });

  const handleAddSample = () => {
    if (editingIndex !== null) {
      update(editingIndex, currentSample as z.infer<typeof sampleSchema>);
      setEditingIndex(null);
    } else {
      append(currentSample as z.infer<typeof sampleSchema>);
    }
    setCurrentSample({ requestedQty: 1, unit: "samples" });
    setShowForm(false);
  };

  const handleEditSample = (index: number) => {
    const { id, ...fieldData } = fields[index] as any;
    setCurrentSample(fieldData);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleRemoveSample = (index: number) => {
    if (confirm("Are you sure you want to remove this sample?")) {
      remove(index);
    }
  };

  const handleNext = async () => {
    const isValid = await form.trigger("samples");
    if (isValid && fields.length > 0) {
      onNext();
    } else if (fields.length === 0) {
      toast.error("Please add at least one sample");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Samples</CardTitle>
        <CardDescription>
          Add one or more samples for this test request
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sample List */}
        {fields.length > 0 && (
          <div className="space-y-2">
            <Label>Added Samples ({fields.length})</Label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{field.customerSampleId}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {field.requestedQty} {field.unit || "samples"}
                      {field.animalType && ` • ${field.animalType}`}
                      {field.panel && ` • ${field.panel}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSample(index)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSample(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Sample Button */}
        {!showForm && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowForm(true);
              setEditingIndex(null);
              setCurrentSample({ requestedQty: 1, unit: "samples" });
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {editingIndex !== null ? "Edit Sample" : "Add Sample"}
          </Button>
        )}

        {/* Sample Form */}
        {showForm && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label>
                Customer Sample ID <span className="text-destructive">*</span>
              </Label>
              <Input
                value={currentSample.customerSampleId || ""}
                onChange={(e) =>
                  setCurrentSample({ ...currentSample, customerSampleId: e.target.value })
                }
                placeholder="Enter sample ID"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Sent Sample Date</Label>
                <Input
                  type="date"
                  value={currentSample.sentSampleDate || ""}
                  onChange={(e) =>
                    setCurrentSample({ ...currentSample, sentSampleDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Animal Type</Label>
                <Input
                  value={currentSample.animalType || ""}
                  onChange={(e) =>
                    setCurrentSample({ ...currentSample, animalType: e.target.value })
                  }
                  placeholder="e.g., Dog, Cat, etc."
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Sample Specimen</Label>
                <Input
                  value={currentSample.sampleSpecimen || ""}
                  onChange={(e) =>
                    setCurrentSample({ ...currentSample, sampleSpecimen: e.target.value })
                  }
                  placeholder="e.g., Blood, Tissue"
                />
              </div>

              <div className="space-y-2">
                <Label>Panel</Label>
                <Input
                  value={currentSample.panel || ""}
                  onChange={(e) =>
                    setCurrentSample({ ...currentSample, panel: e.target.value })
                  }
                  placeholder="Test panel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Method</Label>
              <Input
                value={currentSample.method || ""}
                onChange={(e) =>
                  setCurrentSample({ ...currentSample, method: e.target.value })
                }
                placeholder="Testing method"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Requested Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={currentSample.requestedQty || 1}
                  onChange={(e) =>
                    setCurrentSample({
                      ...currentSample,
                      requestedQty: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={currentSample.unit || "samples"}
                  onChange={(e) =>
                    setCurrentSample({ ...currentSample, unit: e.target.value })
                  }
                  placeholder="e.g., samples, mL, g"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleAddSample}
                disabled={!currentSample.customerSampleId || !currentSample.requestedQty}
              >
                {editingIndex !== null ? "Update Sample" : "Add Sample"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingIndex(null);
                  setCurrentSample({ requestedQty: 1, unit: "samples" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {errors.samples && (
          <p className="text-xs text-destructive">{errors.samples.message}</p>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="button" onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Step 3: Review & Submit
 */
function ReviewStep({
  form,
  onBack,
  onSubmit,
}: {
  form: any;
  onBack: () => void;
  onSubmit: (status: "DRAFT" | "SUBMITTED") => void;
}) {
  const formData = form.watch();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>
          Please review your test request before submitting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onBack()}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
          <div className="rounded-lg border p-4 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Requester:</span>
              <span className="col-span-2 text-sm">{formData.requesterName}</span>
            </div>
            {formData.objective && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Objective:</span>
                <span className="col-span-2 text-sm">{formData.objective}</span>
              </div>
            )}
            {formData.project && formData.project !== "none" && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Project:</span>
                <span className="col-span-2 text-sm capitalize">
                  {formData.project.replace("-", " ")}
                </span>
              </div>
            )}
            {formData.notes && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Notes:</span>
                <span className="col-span-2 text-sm">{formData.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Samples */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Samples ({formData.samples?.length || 0})
          </h3>
          <div className="space-y-2">
            {formData.samples?.map((sample: any, index: number) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{sample.customerSampleId}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Quantity:</span>{" "}
                        {sample.requestedQty} {sample.unit || "samples"}
                      </div>
                      {sample.sentSampleDate && (
                        <div>
                          <span className="font-medium">Date:</span>{" "}
                          {new Date(sample.sentSampleDate).toLocaleDateString()}
                        </div>
                      )}
                      {sample.animalType && (
                        <div>
                          <span className="font-medium">Animal:</span> {sample.animalType}
                        </div>
                      )}
                      {sample.sampleSpecimen && (
                        <div>
                          <span className="font-medium">Specimen:</span>{" "}
                          {sample.sampleSpecimen}
                        </div>
                      )}
                      {sample.panel && (
                        <div>
                          <span className="font-medium">Panel:</span> {sample.panel}
                        </div>
                      )}
                      {sample.method && (
                        <div>
                          <span className="font-medium">Method:</span> {sample.method}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSubmit("DRAFT")}
            >
              Save as Draft
            </Button>
            <Button type="button" onClick={() => onSubmit("SUBMITTED")}>
              <Check className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main New Request Page Component
 */
export default function NewRequestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleSubmit = (status: "DRAFT" | "SUBMITTED") => {
    const formData = form.getValues();

    // TODO: Call API to create test request
    console.log("Submitting request:", { ...formData, documentStatus: status });

    if (status === "DRAFT") {
      toast.success("Request saved as draft");
    } else {
      toast.success("Request submitted successfully");
    }

    // Redirect to requests list
    router.push("/requests");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Test Request</h1>
        <p className="text-muted-foreground">
          Fill out the form to submit a new laboratory test request
        </p>
      </div>

      {/* Stepper */}
      <Stepper currentStep={currentStep} />

      {/* Form Steps */}
      {currentStep === 1 && (
        <BasicInfoStep form={form} onNext={() => setCurrentStep(2)} />
      )}
      {currentStep === 2 && (
        <SamplesStep
          form={form}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}
      {currentStep === 3 && (
        <ReviewStep
          form={form}
          onBack={() => setCurrentStep(2)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
