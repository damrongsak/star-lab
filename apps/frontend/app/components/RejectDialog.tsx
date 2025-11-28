"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const rejectionSchema = z.object({
  reason: z.string().trim().min(1, "Rejection reason is required."),
});

type RejectionFormValues = z.infer<typeof rejectionSchema>;

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void | Promise<void>;
  requestNo: string;
}

export default function RejectDialog({
  open,
  onClose,
  onConfirm,
  requestNo,
}: RejectDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RejectionFormValues>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: { reason: "" },
  });

  useEffect(() => {
    if (!open) {
      reset({ reason: "" });
    }
  }, [open, reset]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const onSubmit = handleSubmit(async ({ reason }) => {
    await onConfirm(reason.trim());
    reset({ reason: "" });
  });

  const reasonValue = watch("reason");
  const isRejectDisabled = !reasonValue.trim() || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Request</DialogTitle>
          <DialogDescription>Reject request {requestNo}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason">
              Rejection Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              rows={4}
              placeholder="Provide a reason for rejection"
              {...register("reason")}
              required
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 text-white hover:bg-red-500"
              disabled={isRejectDisabled}
            >
              Reject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
