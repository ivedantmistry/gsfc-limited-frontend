// src/components/records/RecordActions/RetestModal.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { orderRetest } from "@/lib/api/test";
import { useUsers } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Combobox } from "@/components/ui/combobox"; // Import our new component

interface RetestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number;
}

export default function RetestModal({
  isOpen,
  onClose,
  recordId,
}: RetestModalProps) {
  const router = useRouter();
  const { users, isLoading: isLoadingUsers } = useUsers();
  const [selectedAnalystId, setSelectedAnalystId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAnalystId) {
      // ✅ 3. Update the toast call
      toast.error("Error", {
        description: "Please select an analyst to assign the retest.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const newTestRecord = await orderRetest(
        recordId,
        Number(selectedAnalystId)
      );
      // ✅ 3. Update the toast call
      toast.success("Success", {
        description: `Retest ordered. New record ID: ${newTestRecord.record_id}`,
      });
      setSelectedAnalystId("");
      onClose();
      router.push(`/dashboard/records/${newTestRecord.id}`);
    } catch (error) {
      // ✅ 3. Update the toast call
      toast.error("Error", { description: "Failed to order retest." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const userOptions =
    users?.map((user) => ({ value: String(user.id), label: user.username })) ||
    [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order a Retest</DialogTitle>
          <DialogDescription>
            This will create a new, pending test record linked to the original.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm font-medium mb-2">Assign to Analyst</p>
          <Combobox
            options={userOptions}
            value={selectedAnalystId}
            onValueChange={setSelectedAnalystId}
            placeholder="Select an analyst..."
            searchPlaceholder="Search for an analyst..."
            loading={isLoadingUsers}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoadingUsers}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Order Retest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
