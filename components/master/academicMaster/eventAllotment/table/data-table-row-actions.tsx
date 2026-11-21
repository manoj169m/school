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
import { EventUpdateSheetModal } from "../sheetModel/UpdateSheetModel";
import { EventViewSheetModal } from "../sheetModel/ViewSheetModel";

interface TableActionButtonsProps<TData> {
  row: Row<TData>;
  onDelete?: (id: number) => void; // Callback to refresh data after deletion
}

export function TableActionButtons<TData>({
  row,
  onDelete,
}: TableActionButtonsProps<TData>) {
  const rowData = row.original as {
    id?: number;
    branchId?:number;
    type?: string;
    eventName?: string;
    locationName?: string;
    date?: string;
    startTime: string;
    endTime: string;
    organizerName?: string;
    description?: string;
  };
  const eventId = rowData.id;

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
    if (!eventId) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Deleted",
          description: "The event has been deleted successfully.",
          variant: "default",
        });
        if (onDelete) onDelete(eventId); // Refresh the table if a callback is provided
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);

      toast({
        title: "Error",
        description: "Failed to delete the event.",
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
        className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white"
      >
        <FilePenLine className="h-4 w-4" />
      </Button>

      {/* View Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewDetails}
        title="View"
        className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white"
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
            className="bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be
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
      {isUpdateModalOpen && eventId && (
        <EventUpdateSheetModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          eventId={eventId}
          initialData={{
            branchId: rowData.branchId || 0,
            type: rowData.type || "",
            eventName: rowData.eventName || "",
            locationName: rowData.locationName || "",
            date: rowData.date ? new Date(rowData.date) : new Date(),
            startTime: rowData.startTime
              ? new Date(rowData.startTime)
              : new Date(),
            endTime: rowData.endTime ? new Date(rowData.endTime) : new Date(),
            organizerName: rowData.organizerName || "",
            description: rowData.description || "",
          }}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <EventViewSheetModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          eventId={eventId}
          initialData={{
            branchId: rowData.branchId || 0,
            type: rowData.type || "",
            eventName: rowData.eventName || "",
            locationName: rowData.locationName || "",
            date: rowData.date ? new Date(rowData.date) : new Date(),
            startTime: rowData.startTime
              ? new Date(rowData.startTime)
              : new Date(),
            endTime: rowData.endTime ? new Date(rowData.endTime) : new Date(),
            organizerName: rowData.organizerName || "",
            description: rowData.description || "",
          }}
        />
      )}
    </div>
  );
}
