export interface Room {
  id: number;
  hostelId: number;
  floor: number;
  number: number;
  isOccupied: boolean;
  type: 'single' | 'double' | 'triple';
}

export interface HostelRoomStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: string;
}

export interface RoomsByFloor {
  floor: number;
  rooms: Room[];
}