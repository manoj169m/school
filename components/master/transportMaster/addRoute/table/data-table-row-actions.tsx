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
import { RouteUpdateSheetModal } from "../sheetModel/UpdateSheetModel"; // Update path as necessary
import { RouteViewSheetModal } from "../sheetModel/ViewSheetModel"; // Update path as necessary
import { useToast } from "@/hooks/use-toast";

interface TableActionButtonsProps<TData> {
  row: Row<TData>;
  onDelete?: (id: number) => void; // Callback to refresh data after deletion
  onViewDetails?: (id: number) => void;
}

export function TableActionButtons<TData>({
  row,
  onDelete,
}: TableActionButtonsProps<TData>) {
  const rowData = row.original as {
    id?: number;
    routeName?: string;
    noOfStages?: number;
    startPoint?: string;
    endPoint?: string;
    busNo?: number;
    stops?:
      | string[]
      | {
          stopName: string;
          stopNumber: number;
          pickupTime: string;
          dropTime: string;
        }[]; // Updated to support both string and stop objects
  };
  const routeId = rowData.id;

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
    if (!routeId) return;

    try {
      const response = await fetch(`/api/routes/${routeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "The route has been deleted successfully.",
          variant: "default",
        });
        if (onDelete) onDelete(routeId); // Refresh the table if a callback is provided
      } else {
        throw new Error("Failed to delete route");
      }
    } catch (error) {
      console.error("Failed to delete route:", error);

      toast({
        title: "Error",
        description: "Failed to delete the route.",
        variant: "default",
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
        className="bg-white shadow-md  border border-custom-pink-300 hover:bg-gray-100"
      >
        <FilePenLine className="h-4 w-4 text-custom-red-600 font-semibold" />
      </Button>

      {/* View Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewDetails}
        title="View"
        className="bg-white shadow-md  border border-custom-pink-300 hover:bg-gray-100"
      >
        <EyeIcon className="h-4 w-4 text-custom-red-600 font-semibold" />
      </Button>

      {/* Delete Button with AlertDialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            title="Delete"
            className="bg-white shadow-md  border border-custom-pink-300 hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4 text-custom-red-600 font-semibold" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this route? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Modal */}
      {isUpdateModalOpen && routeId && (
        <RouteUpdateSheetModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          routeId={routeId}
          initialData={{
            routeName: rowData.routeName || "",
            noOfStages: rowData.noOfStages || 0,
            startPoint: rowData.startPoint || "",
            endPoint: rowData.endPoint || "",
            busNo: rowData.busNo || 0,
            stops: Array.isArray(rowData.stops)
              ? (
                  rowData.stops as {
                    stopName: string;
                    stopNumber: number;
                    pickupTime: string;
                    dropTime: string;
                  }[]
                ).map((stop, index) => ({
                  stopName: stop.stopName || "", // If stopName doesn't exist, set it as empty string
                  stopNumber: stop.stopNumber || index + 1, // Default to index + 1
                  pickupTime: stop.pickupTime || "00:00", // Default to "00:00"
                  dropTime: stop.dropTime || "00:00", // Default to "00:00"
                }))
              : [], // If stops is not an array, set it to an empty array
          }}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <RouteViewSheetModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          routeId={routeId} // Pass routeId here
          initialData={{
            routeName: rowData.routeName || "",
            noOfStages: rowData.noOfStages || 0,
            startPoint: rowData.startPoint || "",
            endPoint: rowData.endPoint || "",
            busNo: rowData.busNo || 0,
          }}
        />
      )}
    </div>
  );
}
