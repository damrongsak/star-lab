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
  // Map of testId -> { result, notes }
  const [results, setResults] = useState<Record<string, any>>({});

  const handleResultChange = (testId: string, field: string, value: string) => {
    setResults(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [field]: value
      }
    }));
  };

  const handleSave = (testId: string) => {
    const data = results[testId];
    if (!data) return;

    submitResultMutation.mutate({
      testId,
      result: data.result,
      notes: data.notes,
      status: "IN_PROGRESS"
    });
  };

  const handleComplete = (testId: string) => {
    const data = results[testId];
    if (!data || !data.result) {
      toast.error("Please enter a result before completing");
      return;
    }

    submitResultMutation.mutate({
      testId,
      result: data.result,
      notes: data.notes,
      status: "COMPLETED"
    }, {
      onSuccess: () => {
        // If all tests are completed, maybe redirect or show a success message
        // For now, just invalidate queries handled by the hook
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
        {request.samples?.map((sample: any) => (
          <Card key={sample.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Sample: {sample.sampleId} ({sample.sampleType})
                </CardTitle>
                <Badge variant="outline">{sample.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sample.tests?.map((test: any) => (
                  <div key={test.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{test.testName}</h3>
                        <p className="text-sm text-muted-foreground">Code: {test.testCode}</p>
                      </div>
                      <Badge className={test.status === "COMPLETED" ? "bg-green-500" : "bg-yellow-500"}>
                        {test.status}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`result-${test.id}`}>Result Value</Label>
                        <Input 
                          id={`result-${test.id}`}
                          placeholder="Enter result value"
                          defaultValue={test.result}
                          onChange={(e) => handleResultChange(test.id, "result", e.target.value)}
                          disabled={test.status === "COMPLETED"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`notes-${test.id}`}>Notes / Remarks</Label>
                        <Textarea 
                          id={`notes-${test.id}`}
                          placeholder="Optional notes"
                          defaultValue={test.notes}
                          onChange={(e) => handleResultChange(test.id, "notes", e.target.value)}
                          disabled={test.status === "COMPLETED"}
                        />
                      </div>
                    </div>

                    {test.status !== "COMPLETED" && (
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSave(test.id)}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Draft
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleComplete(test.id)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Submit Result
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {(!sample.tests || sample.tests.length === 0) && (
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
