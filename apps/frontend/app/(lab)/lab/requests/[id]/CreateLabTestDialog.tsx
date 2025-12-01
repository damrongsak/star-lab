"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLabTest } from "@/lib/hooks/useLab";
import { Plus } from "lucide-react";

interface CreateLabTestDialogProps {
  sampleId: string;
  trigger?: React.ReactNode;
}

export function CreateLabTestDialog({
  sampleId,
  trigger,
}: CreateLabTestDialogProps) {
  const [open, setOpen] = useState(false);
  const [testPanel, setTestPanel] = useState("");
  const [testMethod, setTestMethod] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: createLabTest, isPending: isCreating } = useCreateLabTest();

  const handleSave = () => {
    if (!testPanel) return;

    createLabTest(
      {
        testRequestSampleId: sampleId,
        testPanel,
        testMethod,
        notes,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTestPanel("");
          setTestMethod("");
          setNotes("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Test
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Lab Test</DialogTitle>
          <DialogDescription>
            Add a new lab test for this sample.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="testPanel">Test Panel *</Label>
            <Input
              id="testPanel"
              value={testPanel}
              onChange={(e) => setTestPanel(e.target.value)}
              placeholder="e.g. CBC, Liver Function"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="testMethod">Test Method</Label>
            <Input
              id="testMethod"
              value={testMethod}
              onChange={(e) => setTestMethod(e.target.value)}
              placeholder="e.g. Automated, Manual"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={!testPanel || isCreating}
          >
            {isCreating ? "Creating..." : "Create Test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
