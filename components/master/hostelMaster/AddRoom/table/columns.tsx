import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";

export interface HostelData {
  id: number;
  hostelName: string;
  totalFloors: number;
  floors: Floor[];
}

export interface Floor {
  floorNumber: number;
  rooms: Room[];
}

export interface Room {
  id: number;
  roomNumber: string;
  capacity: number;
}

export const columns: ColumnDef<HostelData>[] = [
  {
    id: "serialNumber",
    header: "S.No",
    cell: ({ row, table }) => {
      // Calculate the absolute index of the row across pages
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const absoluteRowIndex = pageIndex * pageSize + row.index + 1;

      return (
        <div className="text-center font-medium">
          {absoluteRowIndex}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "hostelName",
    header: "Hostel Name",
    cell: ({ row }) => row.original.hostelName,
  },
  {
    accessorKey: "totalFloors",
    header: "Total Floors",
    cell: ({ row }) => row.original.totalFloors,
  },
  {
    id: "floorNumbers",
    header: "Floor Numbers",
    cell: ({ row }) => row.original.floors.map(f => f.floorNumber).join(", "),
  },
  {
    id: "rooms",
    header: "Rooms",
    cell: ({ row }) =>
      row.original.floors.map((floor) => (
        <div key={floor.floorNumber}>
          <strong>Floor {floor.floorNumber}:</strong>
          {floor.rooms.map((room) => (
            <div key={room.id}>
              Room No: {room.roomNumber}, Capacity: {room.capacity}
            </div>
          ))}
        </div>
      )),
    
  },
  {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      id: "actions",
      cell: ({ row }) => <TableActionButtons row={row} />,
    },
];