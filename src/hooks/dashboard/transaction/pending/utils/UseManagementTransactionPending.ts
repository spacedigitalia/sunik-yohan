import { useState, useEffect } from "react";

import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

import { db } from "@/utils/firebase/transaction";

import { TransactionData } from "@/utils/firebase/transaction";

import { toast } from "sonner";

const deliveryStages = [
  { id: "pending", label: "Pending", description: "Order has been placed" },
  {
    id: "processing",
    label: "Processing",
    description: "Order is being prepared",
  },
  { id: "delivering", label: "Delivering", description: "Order is on the way" },
  {
    id: "completed",
    label: "Completed",
    description: "Order has been delivered",
  },
];

export const useManagementTransactionPending = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  const updateTransactionStatus = async (docId: string, newStatus: string) => {
    try {
      const transactionRef = doc(
        db,
        process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string,
        docId
      );
      const currentTransaction = transactions.find((t) => t.docId === docId);

      // Prevent changing from processing to pending
      if (
        currentTransaction?.deliveryStatus?.status === "processing" &&
        newStatus === "pending"
      ) {
        toast.error("Cannot change status back to pending", {
          description:
            "Once a transaction is in processing, it cannot be reverted to pending status",
        });
        return;
      }

      const currentDate = new Date().toISOString();

      // Create new history entry
      const newHistoryEntry = {
        status: newStatus,
        description:
          deliveryStages.find((stage) => stage.id === newStatus)?.description ||
          "",
        timestamp: currentDate,
      };

      await updateDoc(transactionRef, {
        "deliveryStatus.status": newStatus,
        "deliveryStatus.history": [
          ...(currentTransaction?.deliveryStatus?.history || []),
          newHistoryEntry,
        ],
      });

      // Show toast notification
      toast.success(
        `Status updated to ${
          newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
        }`,
        {
          description: deliveryStages.find((stage) => stage.id === newStatus)
            ?.description,
        }
      );

      // If status is changed to delivering, show countdown and redirect
      if (newStatus === "delivering") {
        let countdown = 5;
        const countdownInterval = setInterval(() => {
          if (countdown > 0) {
            toast.info(
              `Redirecting to delivery page in ${countdown} seconds...`
            );
            countdown--;
          } else {
            clearInterval(countdownInterval);
            window.location.href = "/dashboard/transaction/delivery";
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      // Show error toast
      toast.error("Failed to update delivery status");
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string),
      (querySnapshot) => {
        const transactionData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id, // Store the Firestore document ID
        })) as TransactionData[];

        // Filter transactions that are not delivering or completed
        const pendingTransactions = transactionData.filter(
          (transaction) =>
            transaction.deliveryStatus?.status !== "delivering" &&
            transaction.deliveryStatus?.status !== "completed"
        );

        setTransactions(pendingTransactions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return {
    transactions,
    loading,
    updateTransactionStatus,
    deliveryStages,
  };
};
