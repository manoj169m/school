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
import { CategoryUpdateSheetModal } from "../sheetModel/UpdateSheetModel";
import { CategoryViewSheetModal } from "../sheetModel/ViewSheetModel";

interface TableActionButtonsProps<TData> {
  row: Row<TData>;
  onDelete?: (id: number) => void; // Callback to refresh data after deletion
  onViewDetails?: (id: number) => void;
}

export function TableActionButtons<TData>({ 
  row, 
  onDelete,  
}: TableActionButtonsProps<TData>) {
  const rowData = row.original as { id?: number; category?: string; description?: string };
  const categoryId = rowData.id;

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
    if (!categoryId) return;

    try {
      const response = await fetch(`/api/feeCategory/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "The fee category has been deleted successfully.",
          variant: "default",
        });
        if (onDelete) onDelete(categoryId); // Refresh the table if a callback is provided
      } else {
        throw new Error("Failed to delete fee category");
      }
    } catch (error) {
      console.error('Failed to update category:', error);

      toast({
        title: "Error",
        description: "Failed to delete the fee category.",
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
              Are you sure you want to delete this fee category? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Modal */}
      {isUpdateModalOpen && categoryId && (
        <CategoryUpdateSheetModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          categoryId={categoryId}
          initialData={{
            category: rowData.category || "",
            description: rowData.description || "",
          }}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <CategoryViewSheetModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          categoryId={categoryId}
          initialData={{
            category: rowData.category || "",
            description: rowData.description || "",
          }}
        />
      )}
    </div>
  );
}
