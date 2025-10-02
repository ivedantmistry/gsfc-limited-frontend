// // src/components/records/RecordActions.tsx

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { TestRecord } from "@/lib/types/test.types";
// import { useHasPermission } from "@/hooks/useHasPermission";
// import { useUsers } from "@/lib/api/user";
// import { approveOrRejectTest, orderRetest } from "@/lib/api/test";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Toaster } from "@/components/ui/sonner";
// import { Combobox } from "@/components/ui/combobox"; // Assuming you have a reusable combobox
// import { Loader2 } from "lucide-react";

// interface RecordActionsProps {
//   testRecord: TestRecord;
// }

// export default function RecordActions({ testRecord }: RecordActionsProps) {
//   const router = useRouter();
// //   const { toast } = useToast();
//   const canApprove = useHasPermission("inventory.can_approve_test_records");

//   const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
//   const [isRetestModalOpen, setIsRetestModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleApprove = async () => {
//     setIsSubmitting(true);
//     try {
//       await approveOrRejectTest(testRecord.id, { status: "APPROVED" });
//       toast({ title: "Success", description: "Test record has been approved." });
//       router.refresh();
//     } catch (error) {
//       toast({ variant: "destructive", title: "Error", description: "Failed to approve record." });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!canApprove) {
//     return null; // Don't show this card if user has no permissions
//   }

//   return (
//     <div className="rounded-lg border bg-white shadow-sm">
//       <div className="p-4 border-b">
//         <h3 className="text-lg font-semibold text-slate-800">Actions</h3>
//       </div>
//       <div className="p-4 space-y-3">
//         {testRecord.status === "PENDING" && (
//           <div className="flex gap-2">
//             <Button className="flex-1" onClick={handleApprove} disabled={isSubmitting}>
//               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Approve
//             </Button>
//             <Button variant="destructive" className="flex-1" onClick={() => setIsRejectModalOpen(true)}>
//               Reject
//             </Button>
//           </div>
//         )}
//         {(testRecord.status === "APPROVED" || testRecord.status === "REJECTED") && (
//            <Button className="w-full" onClick={() => setIsRetestModalOpen(true)}>
//              Order Retest
//            </Button>
//         )}
//          {testRecord.status === "RETEST_ORDERED" && (
//            <p className="text-sm text-center text-slate-500">A retest has been ordered for this record.</p>
//          )}
//       </div>

//       {/* MODALS for actions */}
//       <RejectModal
//         isOpen={isRejectModalOpen}
//         onClose={() => setIsRejectModalOpen(false)}
//         recordId={testRecord.id}
//       />
//       <RetestModal
//         isOpen={isRetestModalOpen}
//         onClose={() => setIsRetestModalOpen(false)}
//         recordId={testRecord.id}
//       />
//     </div>
//   );
// }

// // Helper components for modals
// const RejectModal = ({ isOpen, onClose, recordId }: {isOpen: boolean, onClose: () => void, recordId: number}) => {
//     // ... (code for reject modal)
// }
// const RetestModal = ({ isOpen, onClose, recordId }: {isOpen: boolean, onClose: () => void, recordId: number}) => {
//     // ... (code for retest modal)
// }