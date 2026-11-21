
import { HostelRoomStats, Room, RoomsByFloor } from '../types/room';
import { hostels } from './hostels';

export const rooms: Room[] = hostels.flatMap(hostel => 
  Array.from({ length: hostel.totalRooms }, (_, index) => ({
    id: hostel.id * 1000 + index,
    hostelId: hostel.id,
    floor: Math.floor(index / hostel.roomsPerFloor) + 1,
    number: (index % hostel.roomsPerFloor) + 1,
    isOccupied: Math.random() > 0.3, // Simulated occupancy
    type: ['single', 'double', 'triple'][Math.floor(Math.random() * 3)] as Room['type']
  }))
);

export function getHostelRoomStats(hostelId: number): HostelRoomStats {
  const hostelRooms = rooms.filter(room => room.hostelId === hostelId);
  const occupiedRooms = hostelRooms.filter(room => room.isOccupied).length;
  const totalRooms = hostelRooms.length;
  
  return {
    totalRooms,
    occupiedRooms,
    availableRooms: totalRooms - occupiedRooms,
    occupancyRate: `${Math.round((occupiedRooms / totalRooms) * 100)}%`
  };
}

export function getRoomsByFloor(hostelId: number): RoomsByFloor[] {
  const hostelRooms = rooms.filter(room => room.hostelId === hostelId);
  const floors = [...new Set(hostelRooms.map(room => room.floor))];
  
  return floors.map(floor => ({
    floor,
    rooms: hostelRooms.filter(room => room.floor === floor)
  }));
}