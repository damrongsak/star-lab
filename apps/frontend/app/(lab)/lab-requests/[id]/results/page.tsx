"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const requestOverview = { requestNo: "REQ-2024-0115", company: "StarLab Therapeutics", status: "In Progress" };

type TestResultStatus = "PASS" | "FAIL" | "PENDING";

interface TestCatalogItem {
  value: string;
  label: string;
  unit: string;
}

interface SampleMeta {
  id: string;
  type: string;
  description: string;
}

interface SampleTestResult {
  id: string;
  testType: string;
  value: string;
  unit: string;
  status: TestResultStatus;
  notes: string;
}

interface SampleWithResults extends SampleMeta {
  tests: SampleTestResult[];
}

const testCatalog: TestCatalogItem[] = [
  { value: "cbc", label: "Complete Blood Count", unit: "cells/mcL" },
  { value: "viral-load", label: "PCR Viral Load", unit: "copies/mL" },
  { value: "protein", label: "Total Protein Quantification", unit: "mg/dL" },
];

const sampleMetadata: SampleMeta[] = [
  { id: "SMP-901", type: "Blood Plasma", description: "Plasma aliquot for biomarker verification panel." },
  { id: "SMP-902", type: "Tissue", description: "Frozen tissue curls for histopathology and genomics." },
];

const testStatuses: TestResultStatus[] = ["PASS", "FAIL", "PENDING"];

const createTestResult = (sampleId: string, testTypeValue: string): SampleTestResult => {
  const template = testCatalog.find((test) => test.value === testTypeValue);
  return {
    id: `${sampleId}-${testTypeValue}-${Math.random().toString(36).slice(2, 8)}`,
    testType: testTypeValue,
    value: "",
    unit: template?.unit ?? "",
    status: "PENDING",
    notes: "",
  };
};

const buildInitialSamples = (): SampleWithResults[] =>
  sampleMetadata.map((sample) => ({
    ...sample,
    tests: testCatalog.map((test) => createTestResult(sample.id, test.value)),
  }));

export default function TestResultEntryPage() {
  const router = useRouter();
  const [sampleResults, setSampleResults] = useState<SampleWithResults[]>(() => buildInitialSamples());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Results submitted");
    router.push("/lab-requests");
  };

  const handleTestResultChange = (
    sampleId: string,
    testId: string,
    field: "testType" | "value" | "unit" | "status" | "notes",
    nextValue: string
  ) => {
    setSampleResults((previous) =>
      previous.map((sample) => {
        if (sample.id !== sampleId) {
          return sample;
        }

        return {
          ...sample,
          tests: sample.tests.map((test) => {
            if (test.id !== testId) {
              return test;
            }

            if (field === "testType") {
              const selected = testCatalog.find((option) => option.value === nextValue);
              return {
                ...test,
                testType: nextValue,
                unit: selected?.unit ?? test.unit,
              };
            }

            if (field === "status") {
              return {
                ...test,
                status: nextValue as TestResultStatus,
              };
            }

            return {
              ...test,
              [field]: nextValue,
            };
          }),
        };
      })
    );
  };

  const handleAddTestResult = (sampleId: string) => {
    const defaultType = testCatalog[0]?.value;
    if (!defaultType) {
      return;
    }

    setSampleResults((previous) =>
      previous.map((sample) =>
        sample.id === sampleId
          ? {
              ...sample,
              tests: [...sample.tests, createTestResult(sampleId, defaultType)],
            }
          : sample
      )
    );
  };

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
              <dd className="text-lg font-semibold">{requestOverview.requestNo}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Company</dt>
              <dd className="text-lg font-semibold">{requestOverview.company}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>
                <Badge className="mt-1 bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {requestOverview.status}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Samples</CardTitle>
          <CardDescription>Reference-only overview of samples attached to this request.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sample ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleResults.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="font-semibold">{sample.id}</TableCell>
                  <TableCell>{sample.type}</TableCell>
                  <TableCell className="whitespace-normal text-sm" title={sample.description}>
                    {sample.description}
                  </TableCell>
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
              Expand each sample to capture numeric values, units, and validation notes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-4">
              {sampleResults.map((sample) => (
                <AccordionItem key={sample.id} value={sample.id} className="rounded-lg border">
                  <AccordionTrigger className="px-4 text-base font-semibold">
                    <div className="flex flex-col items-start text-left">
                      <span>{sample.id}</span>
                      <span className="text-sm font-normal text-muted-foreground">{sample.type}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-6">
                      {sample.tests.map((test, index) => {
                        const selectedTest = testCatalog.find((option) => option.value === test.testType);
                        return (
                          <div key={test.id} className="space-y-4 rounded-lg border p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium text-muted-foreground">Test #{index + 1}</p>
                              <Badge variant="outline">{selectedTest?.label ?? "Custom"}</Badge>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                              <div className="space-y-2 md:col-span-2">
                                <div className="text-sm font-medium">Test Name</div>
                                <Select
                                  value={test.testType}
                                  onValueChange={(value) =>
                                    handleTestResultChange(sample.id, test.id, "testType", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select test" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {testCatalog.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-medium">Result Value</div>
                                <Input
                                  type="number"
                                  inputMode="decimal"
                                  step="any"
                                  value={test.value}
                                  onChange={(event) =>
                                    handleTestResultChange(sample.id, test.id, "value", event.target.value)
                                  }
                                  placeholder="Enter value"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-medium">Unit</div>
                                <Input
                                  value={test.unit}
                                  onChange={(event) =>
                                    handleTestResultChange(sample.id, test.id, "unit", event.target.value)
                                  }
                                  placeholder="mg/dL"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-medium">Status</div>
                                <Select
                                  value={test.status}
                                  onValueChange={(value) =>
                                    handleTestResultChange(sample.id, test.id, "status", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {testStatuses.map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Notes</div>
                              <Textarea
                                value={test.notes}
                                onChange={(event) =>
                                  handleTestResultChange(sample.id, test.id, "notes", event.target.value)
                                }
                                placeholder="Add observations, instrument IDs, or review comments"
                                rows={3}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <Button type="button" variant="outline" onClick={() => handleAddTestResult(sample.id)}>
                        Add Test Result
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Submit All Results</Button>
        </div>
      </form>
    </div>
  );
}
