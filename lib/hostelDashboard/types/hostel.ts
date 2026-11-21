export interface Hostel {
  id: number;
  name: string;
  floors: number;
  roomsPerFloor: number;
  totalRooms: number;
  warden: string;
  incharge: string;
  contact: string;
  occupancy: string;
  color: string;
}

export interface Student {
  id: number;
  name: string;
  section: string;
  fatherNumber: string;
  hostelName: string;
  floor: number;
  roomNumber: number;
}

export interface Standard {
  id: number;
  name: string;
  color: string;
}