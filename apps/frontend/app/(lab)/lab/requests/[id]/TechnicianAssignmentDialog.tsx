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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTechnicians, useAssignTechnician } from "@/lib/hooks/useLab";
import { UserPlus } from "lucide-react";

interface TechnicianAssignmentDialogProps {
  labTest: any;
  trigger?: React.ReactNode;
}

export function TechnicianAssignmentDialog({
  labTest,
  trigger,
}: TechnicianAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>(
    labTest.assignedLabTechnicianId || "",
  );

  const { data: technicians, isLoading: isLoadingTechnicians } = useTechnicians();
  const { mutate: assignTechnician, isPending: isAssigning } =
    useAssignTechnician();

  const handleSave = () => {
    if (!selectedTechnicianId) return;

    assignTechnician(
      {
        labTestId: labTest.id,
        technicianId: selectedTechnicianId,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Assign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
          <DialogDescription>
            Assign a laboratory technician to perform this test.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="technician" className="text-right">
              Technician
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedTechnicianId}
                onValueChange={setSelectedTechnicianId}
                disabled={isLoadingTechnicians || isAssigning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a technician" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingTechnicians ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : technicians && technicians.length > 0 ? (
                    technicians.map((tech: any) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.userProfile?.firstName} {tech.userProfile?.lastName}
                        {!tech.userProfile && `(${tech.email})`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No technicians available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={!selectedTechnicianId || isAssigning}
          >
            {isAssigning ? "Assigning..." : "Save Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
