"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useLabRequest, useCreateLabResult, useUpdateLabResult } from "@/lib/hooks/useLab";
import { LabTest, LabResult } from "@star-lab/shared";

type TestResultStatus = "PASS" | "FAIL" | "PENDING";

interface EditableLabResult extends Partial<LabResult> {
  tempId?: string; // For new results not yet saved
  status?: TestResultStatus; // UI specific status
}

interface TestCatalogItem {
  value: string;
  label: string;
  unit: string;
}

const testCatalog: TestCatalogItem[] = [
  { value: "Hemoglobin", label: "Hemoglobin", unit: "g/dL" },
  { value: "WBC", label: "White Blood Cells", unit: "cells/mcL" },
  { value: "RBC", label: "Red Blood Cells", unit: "cells/mcL" },
  { value: "Platelets", label: "Platelets", unit: "cells/mcL" },
  { value: "Viral Load", label: "PCR Viral Load", unit: "copies/mL" },
  { value: "Protein", label: "Total Protein", unit: "mg/dL" },
];

export default function TestResultEntryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { data: request, isLoading } = useLabRequest(id);
  const createResultMutation = useCreateLabResult();
  const updateResultMutation = useUpdateLabResult();

  // Map of labTestId -> Array of results
  const [resultMap, setResultMap] = useState<Record<string, EditableLabResult[]>>({});

  // Initialize state from fetched data
  useEffect(() => {
    if (request?.samples) {
      const initialMap: Record<string, EditableLabResult[]> = {};
      
      request.samples.forEach(sample => {
        const labTests = sample.labTests;
        
        if (labTests) {
          labTests.forEach(test => {
            if (test.labResults && test.labResults.length > 0) {
              initialMap[test.id] = test.labResults.map(r => ({ ...r }));
            } else {
              // If no results, add a default empty one
              initialMap[test.id] = [{
                tempId: Math.random().toString(36).slice(2),
                parameter: "",
                value: "",
                unit: "",
                notes: ""
              }];
            }
          });
        }
      });
      
      setResultMap(initialMap);
    }
  }, [request]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const promises: Promise<any>[] = [];

      // Iterate through all lab tests and their results
      Object.entries(resultMap).forEach(([labTestId, results]) => {
        results.forEach(result => {
          // Skip empty entries
          if (!result.parameter || !result.value) return;

          if (result.id) {
            // Update existing
            promises.push(updateResultMutation.mutateAsync({
              id: result.id,
              payload: {
                parameter: result.parameter,
                value: result.value,
                unit: result.unit,
                notes: result.notes,
                isAbnormal: result.isAbnormal
              }
            }));
          } else {
            // Create new
            promises.push(createResultMutation.mutateAsync({
              labTestId,
              parameter: result.parameter,
              value: result.value,
              unit: result.unit,
              notes: result.notes,
              isAbnormal: result.isAbnormal,
              recordedById: "current-user" // Backend handles this from token
            }));
          }
        });
      });

      await Promise.all(promises);
      toast.success("Results submitted successfully");
      router.push("/lab-requests");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit results");
    }
  };

  const handleResultChange = (
    labTestId: string,
    resultIndex: number,
    field: keyof EditableLabResult,
    value: any
  ) => {
    setResultMap(prev => {
      const newResults = [...(prev[labTestId] || [])];
      newResults[resultIndex] = { ...newResults[resultIndex], [field]: value };
      
      // Auto-fill unit if parameter matches catalog
      if (field === 'parameter') {
        const catalogItem = testCatalog.find(i => i.value === value);
        if (catalogItem) {
          newResults[resultIndex].unit = catalogItem.unit;
        }
      }
      
      return { ...prev, [labTestId]: newResults };
    });
  };

  const handleAddResult = (labTestId: string) => {
    setResultMap(prev => ({
      ...prev,
      [labTestId]: [
        ...(prev[labTestId] || []),
        {
          tempId: Math.random().toString(36).slice(2),
          parameter: "",
          value: "",
          unit: "",
          notes: ""
        }
      ]
    }));
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading request details...</div>;
  }

  if (!request) {
    return <div className="p-8 text-center">Request not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Test Result Entry</h1>
        <p className="text-muted-foreground">Record verified results for every sample in this request.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Summary</CardTitle>
          <CardDescription>Review the request information before logging results.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted-foreground">Request No</dt>
              <dd className="text-lg font-semibold">{request.requestNo}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Company</dt>
              <dd className="text-lg font-semibold">{request.company || request.customer?.companyNameEn}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>
                <Badge className="mt-1">
                  {request.labInternalStatus}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Samples</CardTitle>
          <CardDescription>Overview of samples attached to this request.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sample ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Panel</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {request.samples?.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="font-semibold">{sample.customerSampleId}</TableCell>
                  <TableCell>{sample.sampleSpecimen || sample.animalType}</TableCell>
                  <TableCell>{sample.panel}</TableCell>
                  <TableCell>{sample.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Sample Test Results</CardTitle>
            <CardDescription>
              Enter numeric values, units, and validation notes for each test.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-4" defaultValue={request.samples?.map(s => s.id)}>
              {request.samples?.map((sample) => {
                const labTests = sample.labTests;
                
                if (!labTests || labTests.length === 0) {
                  return (
                    <AccordionItem key={sample.id} value={sample.id} className="rounded-lg border">
                       <AccordionTrigger className="px-4 text-base font-semibold">
                        <div className="flex flex-col items-start text-left">
                          <span>{sample.customerSampleId}</span>
                          <span className="text-sm font-normal text-muted-foreground">No Lab Test Assigned</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-4 text-muted-foreground">
                        Please assign a technician to this sample to start testing.
                      </AccordionContent>
                    </AccordionItem>
                  );
                }

                return labTests.map(test => (
                  <AccordionItem key={test.id} value={test.id} className="rounded-lg border">
                    <AccordionTrigger className="px-4 text-base font-semibold">
                      <div className="flex flex-col items-start text-left">
                        <span>{sample.customerSampleId}</span>
                        <span className="text-sm font-normal text-muted-foreground">{test.testPanel} ({test.caseNo})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <div className="space-y-6 pt-4">
                        {resultMap[test.id]?.map((result, index) => (
                          <div key={result.id || result.tempId} className="space-y-4 rounded-lg border p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium text-muted-foreground">Result #{index + 1}</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                              <div className="space-y-2 md:col-span-2">
                                <div className="text-sm font-medium">Parameter</div>
                                <div className="relative">
                                  <Input 
                                    list={`params-${test.id}`}
                                    value={result.parameter || ""}
                                    onChange={(e) => handleResultChange(test.id, index, "parameter", e.target.value)}
                                    placeholder="e.g. Hemoglobin"
                                  />
                                  <datalist id={`params-${test.id}`}>
                                    {testCatalog.map(t => (
                                      <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                  </datalist>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-medium">Value</div>
                                <Input
                                  type="text"
                                  value={result.value || ""}
                                  onChange={(e) => handleResultChange(test.id, index, "value", e.target.value)}
                                  placeholder="Enter value"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-medium">Unit</div>
                                <Input
                                  value={result.unit || ""}
                                  onChange={(e) => handleResultChange(test.id, index, "unit", e.target.value)}
                                  placeholder="e.g. mg/dL"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Notes</div>
                              <Textarea
                                value={result.notes || ""}
                                onChange={(e) => handleResultChange(test.id, index, "notes", e.target.value)}
                                placeholder="Observations or comments"
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}

                        <Button type="button" variant="outline" onClick={() => handleAddResult(test.id)}>
                          + Add Another Parameter
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ));
              })}
            </Accordion>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={createResultMutation.isPending || updateResultMutation.isPending}>
            {(createResultMutation.isPending || updateResultMutation.isPending) ? "Submitting..." : "Submit All Results"}
          </Button>
        </div>
      </form>
    </div>
  );
}