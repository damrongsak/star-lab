"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAcknowledgeSamples, useLabRequest } from "@/lib/hooks/useLab";

export default function SampleAcknowledgmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: request, isLoading } = useLabRequest(id);
  const acknowledgeMutation = useAcknowledgeSamples();

  const [checked, setChecked] = useState(false);
  const [notes, setNotes] = useState("");

  const requestDateValue = request?.date ?? request?.requestDate ?? request?.createdAt;
  const formattedRequestDate = requestDateValue
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(requestDateValue))
    : "-";
  const samples = request?.samples ?? [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) {
      toast.error("Request ID is missing.");
      return;
    }

    acknowledgeMutation.mutate(
      { id, notes, allSamplesReceived: checked },
      {
        onSuccess: () => {
          toast.success("Samples acknowledged successfully");
          router.push("/lab-requests");
        },
        onError: () => {
          toast.error("Failed to acknowledge samples.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p className="py-10 text-center text-muted-foreground">Loading request...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-6">
        <p className="py-10 text-center text-muted-foreground">Lab request not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Sample Acknowledgment</h1>
        <p className="text-muted-foreground">Review the incoming samples and confirm receipt.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Confirm the request information before acknowledging the samples.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted-foreground">Request No</dt>
              <dd className="text-lg font-semibold">{request.requestNo}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Company</dt>
              <dd className="text-lg font-semibold">{request.company ?? "Unknown Company"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Date</dt>
              <dd className="text-lg font-semibold">{formattedRequestDate}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Samples Received</CardTitle>
          <CardDescription>Verify every sample against the packing list.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sample ID</TableHead>
                <TableHead>Sample Type</TableHead>
                <TableHead>Panel</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell>{sample.customerSampleId}</TableCell>
                  <TableCell>{sample.sampleSpecimen || sample.animalType}</TableCell>
                  <TableCell className="whitespace-normal" title={sample.notes}>
                    {sample.panel}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{sample.requestedQty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acknowledgment</CardTitle>
          <CardDescription>Confirm condition of the samples and leave optional notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="flex items-center gap-3 text-sm font-medium" htmlFor="condition">
              <Checkbox
                id="condition"
                checked={checked}
                onCheckedChange={(value) => setChecked(value === true)}
              />
              All samples received in good condition
            </label>

            <div className="space-y-2">
              <div className="text-sm font-medium">Notes (optional)</div>
              <Textarea
                placeholder="Add any observations or discrepancies..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={!checked}>
                Acknowledge Receipt
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
