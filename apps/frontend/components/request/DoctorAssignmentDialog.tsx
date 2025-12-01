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
import { useDoctors, useAssignDoctor } from "@/lib/hooks/useDoctor";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface DoctorAssignmentDialogProps {
  requestId: string;
  currentDoctorId?: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function DoctorAssignmentDialog({
  requestId,
  currentDoctorId,
  trigger,
  onSuccess,
}: DoctorAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    currentDoctorId || "",
  );

  const { data: doctors, isLoading: isLoadingDoctors } = useDoctors();
  const { assignDoctor, isAssigning } = useAssignDoctor();

  const handleSave = async () => {
    if (!selectedDoctorId) return;

    try {
      await assignDoctor({
        testRequestId: requestId,
        doctorId: selectedDoctorId,
      });
      toast.success("Doctor assigned successfully");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign doctor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Assign Doctor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Doctor</DialogTitle>
          <DialogDescription>
            Assign a doctor to review and approve this request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doctor" className="text-right">
              Doctor
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedDoctorId}
                onValueChange={setSelectedDoctorId}
                disabled={isLoadingDoctors || isAssigning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingDoctors ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : doctors && doctors.length > 0 ? (
                    doctors.map((doc: any) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.user?.userProfile?.firstName} {doc.user?.userProfile?.lastName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No doctors available
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
            disabled={!selectedDoctorId || isAssigning}
          >
            {isAssigning ? "Assigning..." : "Save Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
