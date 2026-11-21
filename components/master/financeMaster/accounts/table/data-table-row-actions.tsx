"use client";

import { Row } from "@tanstack/react-table";
import { FilePenLine, EyeIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { AccountUpdateSheetModal } from "../sheetModel/UpdateSheetModel"; // Adjust the path as necessary
import { AccountViewSheetModal } from "../sheetModel/ViewSheetModel"; // You can create a similar view modal
import { AccountType, ApplicableCategory } from "@prisma/client";

interface TableActionButtonsProps<TData> {
  row: Row<TData>;
  onDelete?: (id: number) => void; // Callback to refresh data after deletion
  onViewDetails?: (id: number) => void;
}

export function TableActionButtons<TData>({ 
  row, 
  onDelete,  
}: TableActionButtonsProps<TData>) {
  const rowData = row.original as { id?: number; accountName?: string; accountType?: AccountType; description?: string; openingBalance?: number; applicableFor?: ApplicableCategory};
  const accountId = rowData.id;

  const { toast } = useToast();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleViewDetails = () => {
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleDelete = async () => {
    if (!accountId) return;

    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "The account has been deleted successfully.",
          variant: "default",
        });
        if (onDelete) onDelete(accountId); // Refresh the table if a callback is provided
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error('Failed to delete account:', error);

      toast({
        title: "Error",
        description: "Failed to delete the account.",
        variant: 'default',
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Update Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenUpdateModal}
        title="Update"
        className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white "
      >
        <FilePenLine className="h-4 w-4" />
      </Button>

      {/* View Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewDetails}
        title="View"
        className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white "
      >
        <EyeIcon className="h-4 w-4" />
      </Button>

      {/* Delete Button with AlertDialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            title="Delete"
            className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white "
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this account? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Modal */}
      {isUpdateModalOpen && accountId && (
        <AccountUpdateSheetModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          accountId={accountId}
          initialData={{
            accountName: rowData.accountName || "",
            accountType: rowData.accountType || "ASSET", // Default to 'ASSET'
            description: rowData.description || "",
            openingBalance: rowData.openingBalance || 0,
            applicableFor: rowData.applicableFor || "NONE",
          }}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && accountId && (
        <AccountViewSheetModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          accountId={accountId}
          initialData={{
            accountName: rowData.accountName || "",
            accountType: rowData.accountType || "ASSET",
            description: rowData.description || "",
            openingBalance: rowData.openingBalance || 0,
            applicableFor: rowData.applicableFor || "NONE",
          }}
        />
      )}
    </div>
  );
}
