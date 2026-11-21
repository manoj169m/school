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
import { UpdateFeeByHostelSheetModal } from "../sheetModel/UpdateSheetModel";
import { FeeByHostelViewSheetModal } from "../sheetModel/ViewSheetModel";

interface TableActionButtonsProps<TData> {
  row: Row<TData>;
  onDelete?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

export function TableActionButtons<TData>({
  row,
  onDelete,
}: TableActionButtonsProps<TData>) {
  const rowData = row.original as {
    id: number;
    academicYearId: number;
    hostelId: number;
    accountId: number;
    academicYear: string;
    hostelName: string;
    accountName: string;
    term: number;
    feeAmount: number;
  };
  
  const feeByHostelId = rowData.id;

  const { toast } = useToast();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleOpenUpdateModal = () => {
    if (!feeByHostelId) {
      toast({
        title: "Error",
        description: "Invalid fee ID.",
        variant: "destructive",
      });
      return;
    }
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleViewDetails = () => {
    if (!feeByHostelId) {
      toast({
        title: "Error",
        description: "Invalid fee ID.",
        variant: "destructive",
      });
      return;
    }
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleDelete = async () => {
    if (!feeByHostelId) {
      toast({
        title: "Error",
        description: "Invalid fee ID.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/fee-by-hostel/${feeByHostelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "The fee record has been deleted successfully.",
          variant: "default",
        });
        if (onDelete) onDelete(feeByHostelId);
      } else {
        throw new Error("Failed to delete fee record");
      }
    } catch (error) {
      console.error("Failed to delete fee record:", error);
      toast({
        title: "Error",
        description: "Failed to delete the fee record.",
        variant: "destructive",
      });
    }
  };

  const handleFeeUpdated = async () => {
    if (onDelete) {
      await onDelete(feeByHostelId);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenUpdateModal}
        title="Update"
        className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white"
      >
        <FilePenLine className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleViewDetails}
        title="View"
        className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white"
      >
        <EyeIcon className="h-4 w-4" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            title="Delete"
            className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this fee record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isUpdateModalOpen && (
        <UpdateFeeByHostelSheetModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          initialData={{
            id: rowData.id,
            academicYearId: rowData.academicYearId,
            hostelId: rowData.hostelId,
            accountId: rowData.accountId,
            term: rowData.term,
            feeAmount: rowData.feeAmount
          }}
          onFeeByHostelUpdated={handleFeeUpdated}
        />
      )}

{isViewModalOpen && (
  <FeeByHostelViewSheetModal
    isOpen={isViewModalOpen}
    onClose={handleCloseViewModal}
    initialData={{
      id: rowData.id,
      academicYearId: rowData.academicYearId,
      hostelId: rowData.hostelId,
      accountId: rowData.accountId,
      term: rowData.term,
      feeAmount: rowData.feeAmount
    }}
  />
)}
    </div>
  );
}