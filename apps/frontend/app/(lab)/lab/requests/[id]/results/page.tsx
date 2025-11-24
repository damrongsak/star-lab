"use client";

import { useLabRequest, useSubmitResult } from "@/lib/hooks/useLab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Send } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function TestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: request, isLoading } = useLabRequest(id);
  const submitResultMutation = useSubmitResult();
  
  // Local state to track results for each test
  // Map of labTestId -> { value, notes }
  const [results, setResults] = useState<Record<string, any>>({});

  const handleResultChange = (labTestId: string, field: string, value: string) => {
    setResults(prev => ({
      ...prev,
      [labTestId]: {
        ...prev[labTestId],
        [field]: value
      }
    }));
  };

  const handleSave = (labTest: any) => {
    const data = results[labTest.id] || {};
    // Use existing result value if not changed
    const currentResult = labTest.labResults?.[0];
    const value = data.value !== undefined ? data.value : (currentResult?.value || "");
    const notes = data.notes !== undefined ? data.notes : (currentResult?.notes || "");

    if (!value) {
      toast.error("Please enter a result value");
      return;
    }

    submitResultMutation.mutate({
      labTestId: labTest.id,
      resultId: currentResult?.id,
      parameter: labTest.testPanel || "Test Result", // Default parameter name if not specified
      value: value,
      notes: notes,
      status: "IN_PROGRESS"
    });
  };

  const handleComplete = (labTest: any) => {
    const data = results[labTest.id] || {};
    const currentResult = labTest.labResults?.[0];
    const value = data.value !== undefined ? data.value : (currentResult?.value || "");
    const notes = data.notes !== undefined ? data.notes : (currentResult?.notes || "");

    if (!value) {
      toast.error("Please enter a result before completing");
      return;
    }

    submitResultMutation.mutate({
      labTestId: labTest.id,
      resultId: currentResult?.id,
      parameter: labTest.testPanel || "Test Result",
      value: value,
      notes: notes,
      status: "COMPLETED"
    }, {
      onSuccess: () => {
        // Optional: redirect or refresh
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Enter Test Results</h1>
          <p className="text-muted-foreground">
            Record results for Request #{request.requestNo}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {request.testRequestSamples?.map((sample: any) => (
          <Card key={sample.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Sample: {sample.customerSampleId} ({sample.sampleSpecimen || sample.animalType})
                </CardTitle>
                <Badge variant="outline">{sample.currentStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sample.labTests?.map((test: any) => {
                  const currentResult = test.labResults?.[0];
                  const isCompleted = test.labResultStatus === "COMPLETED";
                  
                  return (
                    <div key={test.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{test.testPanel}</h3>
                          <p className="text-sm text-muted-foreground">Method: {test.testMethod}</p>
                        </div>
                        <Badge className={isCompleted ? "bg-green-500" : "bg-yellow-500"}>
                          {test.labResultStatus}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`result-${test.id}`}>Result Value</Label>
                          <Input 
                            id={`result-${test.id}`}
                            placeholder="Enter result value"
                            defaultValue={currentResult?.value}
                            onChange={(e) => handleResultChange(test.id, "value", e.target.value)}
                            disabled={isCompleted}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${test.id}`}>Notes / Remarks</Label>
                          <Textarea 
                            id={`notes-${test.id}`}
                            placeholder="Optional notes"
                            defaultValue={currentResult?.notes}
                            onChange={(e) => handleResultChange(test.id, "notes", e.target.value)}
                            disabled={isCompleted}
                          />
                        </div>
                      </div>

                      {!isCompleted && (
                        <div className="flex justify-end gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSave(test)}
                            disabled={submitResultMutation.isPending}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleComplete(test)}
                            disabled={submitResultMutation.isPending}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Submit Result
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {(!sample.labTests || sample.labTests.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground">
                    No tests assigned to this sample yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
