"use client";

import { useState } from "react";
import {
  Controller,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowLeft, ArrowRight, Check, Edit2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useProjects } from "@/lib/hooks/useProjects";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";

export const sampleSchema = z.object({
  customerSampleId: z.string().min(1, "Sample ID is required"),
  sentSampleDate: z.string().optional(),
  animalType: z.string().optional(),
  sampleSpecimen: z.string().optional(),
  panel: z.string().optional(),
  method: z.string().optional(),
  requestedQty: z.coerce.number().min(1, "Quantity must be at least 1"),
  unit: z.string(),
});

export const formSchema = z.object({
  requesterName: z.string().min(2, "Requester name must be at least 2 characters"),
  objective: z.string().optional(),
  project: z.string().optional(),
  notes: z.string().optional(),
  samples: z.array(sampleSchema).min(1, "At least one sample is required"),
});

export type FormValues = z.output<typeof formSchema>;

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

function BasicInfoStep({
  form,
  onNext,
}: {
  form: UseFormReturn<FormValues>;
  onNext: () => void;
}) {
  const {
    register,
    control,
    formState: { errors },
    trigger,
  } = form;

  const { data: projects } = useProjects();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  const handleNext = async () => {
    const isValid = await trigger(["requesterName", "objective", "project", "notes"]);
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
          <Input id="requestNo" placeholder="Will be generated automatically" disabled />
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
          <div className="flex items-center justify-between">
            <Label htmlFor="project">Project</Label>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-xs"
              onClick={() => setIsProjectFormOpen(true)}
            >
              <Plus className="mr-1 h-3 w-3" />
              New Project
            </Button>
          </div>
          <Controller
            name="project"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.projectCode} - {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <ProjectFormDialog
            open={isProjectFormOpen}
            onOpenChange={setIsProjectFormOpen}
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
          <Button type="button" onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SamplesStep({
  form,
  onBack,
  onNext,
}: {
  form: UseFormReturn<FormValues>;
  onBack: () => void;
  onNext: () => void;
}) {
  const {
    control,
    formState: { errors },
    trigger,
  } = form;

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "samples",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentSample, setCurrentSample] = useState<
    FormValues["samples"][number]
  >({
    customerSampleId: "",
    requestedQty: 1,
    unit: "samples",
  });

  const resetSampleForm = () => {
    setCurrentSample({ customerSampleId: "", requestedQty: 1, unit: "samples" });
    setEditingIndex(null);
  };

  const handleAddSample = () => {
    if (!currentSample.customerSampleId || !currentSample.requestedQty) {
      toast.error("Sample ID and quantity are required");
      return;
    }

    const sanitizedSample: FormValues["samples"][number] = {
      ...currentSample,
      sentSampleDate: currentSample.sentSampleDate || undefined,
      animalType: currentSample.animalType || undefined,
      sampleSpecimen: currentSample.sampleSpecimen || undefined,
      panel: currentSample.panel || undefined,
      method: currentSample.method || undefined,
      unit: currentSample.unit || "samples",
    };

    if (editingIndex !== null) {
      update(editingIndex, sanitizedSample);
    } else {
      append(sanitizedSample);
    }

    setShowForm(false);
    resetSampleForm();
  };

  const handleEditSample = (index: number) => {
    const fieldData = fields[index] as unknown as FormValues["samples"][number];
    setCurrentSample({
      ...fieldData,
      sentSampleDate: fieldData.sentSampleDate || undefined,
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleRemoveSample = (index: number) => {
    if (confirm("Are you sure you want to remove this sample?")) {
      remove(index);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger("samples");
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
        {fields.length > 0 && (
          <div className="space-y-2">
            <Label>Added Samples ({fields.length})</Label>
            <div className="space-y-2">
              {fields.map((field, index) => {
                const fieldData = field as unknown as FormValues["samples"][number] & {
                  id: string;
                };
                return (
                  <div
                    key={field.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{fieldData.customerSampleId}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {fieldData.requestedQty}{" "}
                        {fieldData.unit || "samples"}
                        {fieldData.animalType && ` • ${fieldData.animalType}`}
                        {fieldData.panel && ` • ${fieldData.panel}`}
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
                );
              })}
            </div>
          </div>
        )}

        {!showForm && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowForm(true);
              resetSampleForm();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {editingIndex !== null ? "Edit Sample" : "Add Sample"}
          </Button>
        )}

        {showForm && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label>
                Customer Sample ID <span className="text-destructive">*</span>
              </Label>
              <Input
                value={currentSample.customerSampleId || ""}
                onChange={(e) =>
                  setCurrentSample({
                    ...currentSample,
                    customerSampleId: e.target.value,
                  })
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
                    setCurrentSample({
                      ...currentSample,
                      sentSampleDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Animal Type</Label>
                <Input
                  value={currentSample.animalType || ""}
                  onChange={(e) =>
                    setCurrentSample({
                      ...currentSample,
                      animalType: e.target.value,
                    })
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
                    setCurrentSample({
                      ...currentSample,
                      sampleSpecimen: e.target.value,
                    })
                  }
                  placeholder="e.g., Blood, Tissue"
                />
              </div>

              <div className="space-y-2">
                <Label>Panel</Label>
                <Input
                  value={currentSample.panel || ""}
                  onChange={(e) =>
                    setCurrentSample({
                      ...currentSample,
                      panel: e.target.value,
                    })
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
                  setCurrentSample({
                    ...currentSample,
                    method: e.target.value,
                  })
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
                      requestedQty: parseInt(e.target.value, 10) || 1,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={currentSample.unit || "samples"}
                  onChange={(e) =>
                    setCurrentSample({
                      ...currentSample,
                      unit: e.target.value,
                    })
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
                  resetSampleForm();
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

function ReviewStep({
  form,
  onBack,
  onSubmit,
  isSubmitting,
  submitLabel,
}: {
  form: UseFormReturn<FormValues>;
  onBack: () => void;
  onSubmit: (status: "DRAFT" | "SUBMITTED") => void;
  isSubmitting?: boolean;
  submitLabel: string;
}) {
  const formData = form.watch() as FormValues;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>
          Please review your test request before submitting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <Button type="button" variant="ghost" size="sm" onClick={onBack}>
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

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Samples ({formData.samples?.length || 0})
          </h3>
          <div className="space-y-2">
            {formData.samples?.map((sample, index) => (
              <div key={`${sample.customerSampleId}-${index}`} className="rounded-lg border p-4">
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
                          <span className="font-medium">Animal:</span>{" "}
                          {sample.animalType}
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
                          <span className="font-medium">Method:</span>{" "}
                          {sample.method}
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
          <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSubmit("DRAFT")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              type="button"
              onClick={() => onSubmit("SUBMITTED")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : submitLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TestRequestFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (status: "DRAFT" | "SUBMITTED") => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function TestRequestForm({
  form,
  onSubmit,
  isSubmitting,
  submitLabel = "Submit Request",
}: TestRequestFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="space-y-6">
      <Stepper currentStep={currentStep} />

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
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
        />
      )}
    </div>
  );
}
