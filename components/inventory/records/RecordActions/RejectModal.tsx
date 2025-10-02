// src/components/records/RecordActions/RejectModal.tsx

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { approveOrRejectTest } from "@/lib/api/test";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number;
}

export default function RejectModal({
  isOpen,
  onClose,
  recordId,
}: RejectModalProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<{ comments: string }>();

  const onSubmit = async (data: { comments: string }) => {
    try {
      await approveOrRejectTest(recordId, {
        status: "REJECTED",
        supervisor_comments: data.comments,
      });
      // ✅ 3. Update the toast call
      toast.success("Success", {
        description: "Test record has been rejected.",
      });
      reset();
      onClose();
      router.refresh();
    } catch (error) {
      // ✅ 3. Update the toast call
      toast.error("Error", { description: "Failed to reject record." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Reject Test Record</DialogTitle>
            <DialogDescription>
              Please provide a reason for the rejection. This will be recorded.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Rejection comments (required)..."
              {...register("comments", {
                required: "Comments are required for rejection.",
              })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
