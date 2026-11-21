import { useState } from "react";

interface Route {
  id: number;
  routeName: string;
  academicYearId: number;
  numberOfStops: number;
  vehicleId: number;
}

interface Stop {
  id: number;
  stopName: string;
  stopNumber: number;
  distance: string;
  landMark: string;
  routeId: number;
}

interface Hostel {
  id: number;
  hostelName: string;
  capacity: number;
  type: string;
  floorCount: number;
}

interface Room {
  id: number;
  roomNumber: string;
  capacity: number;
  floorNumber: number;
  hostelId: number;
}
  
  // API functions
  const api = {
    // Get routes by academic year
    async getRoutes(academicYearId: string): Promise<Route[]> {
      try {
        console.log('Fetching routes with academicYearId:', academicYearId); // Debug log
        const response = await fetch(`/api/adminroutes/${academicYearId}`);
        if (!response.ok) {
          console.error('Response not OK:', await response.text());
          throw new Error('Failed to fetch routes');
        }
        const data = await response.json();
        console.log('Routes data received:', data); // Debug log
        return data;
      } catch (error) {
        console.error('Error fetching routes:', error);
        return [];
      }
    },
  
    // Get stops by route
    async getStops(routeId: string): Promise<Stop[]> {
      try {
        const response = await fetch(`/api/stops/${routeId}`);
        if (!response.ok) {
          console.error('Response not OK:', await response.text());
          throw new Error('Failed to fetch stops');
        }
        const data = await response.json();
        console.log('Stops data:', data); // Debug log
        return data;
      } catch (error) {
        console.error('Error fetching stops:', error);
        return [];
      }
    },
  
  
    // Get hostels
    async getHostels(): Promise<Hostel[]> {
      try {
        const response = await fetch('/api/hostels');
        if (!response.ok) throw new Error('Failed to fetch hostels');
        return response.json();
      } catch (error) {
        console.error('Error fetching hostels:', error);
        return [];
      }
    },
  
    // Get rooms by hostel
    async getRooms(hostelId: string): Promise<Room[]> {
      try {
        const response = await fetch(`/api/rooms/${hostelId}`);
        if (!response.ok) throw new Error('Failed to fetch rooms');
        return response.json();
      } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
      }
    }
  };
  
  // Form state and handlers
  const useTransportHostelForm = () => {
    // Form states
    const [routes, setRoutes] = useState<Route[]>([]);
    const [stops, setStops] = useState<Stop[]>([]);
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
  
    const [currentAcademicYear, setCurrentAcademicYear] = useState<string>('');
    // Selected value states
    const [selectedTransport, setSelectedTransport] = useState<string>('');
    const [selectedRoute, setSelectedRoute] = useState<string>('');
    const [selectedStop, setSelectedStop] = useState<string>('');
    const [selectedHostel, setSelectedHostel] = useState<string>('');
    const [selectedRoom, setSelectedRoom] = useState<string>('');

    const handleTransportChange = async (value: string | string[]) => {
      if (typeof value === 'string') {
        console.log('Transport changed to:', value);
        setSelectedTransport(value);
        
        if (value === 'Using' && currentAcademicYear) {
          // Fetch routes if academic year is already selected
          console.log('Fetching routes for academic year:', currentAcademicYear);
          const routesData = await api.getRoutes(currentAcademicYear);
          setRoutes(routesData);
        } else {
          // Clear routes and stops if transport is not "Using"
          setSelectedRoute('');
          setSelectedStop('');
          setRoutes([]);
          setStops([]);
        }
      }
    };
  
    // Handle academic year change
    const handleTransportAcademicYearChange = async (value: string) => {
      setCurrentAcademicYear(value);
      if (selectedTransport === 'Using') {
        console.log('Fetching routes for academic year:', value);
        const routesData = await api.getRoutes(value);
        setRoutes(routesData);
        setSelectedRoute('');
        setSelectedStop('');
        setStops([]);
      }
    };
  
    // Handle route change
    const handleRouteChange = async (value: string | string[]) => {
      if (typeof value === 'string') {
        console.log('Route changed to:', value); // Debug log
        setSelectedRoute(value);
        const stopsData = await api.getStops(value);
        console.log('Received stops:', stopsData); // Debug log
        setStops(stopsData);
        setSelectedStop('');
      }
    };
  
  
    // Handle hostel selection change
    const handleHostelChange = async (value: string | string[]) => {
      if (typeof value === 'string') {
        setSelectedHostel(value);
        if (value === 'Using') {
          const hostelsData = await api.getHostels();
          setHostels(hostelsData);
        } else {
          setHostels([]);
          setRooms([]);
          setSelectedRoom('');
        }
      }
    };
  
    // Handle hostel name change
    const handleHostelNameChange = async (value: string | string[]) => {
      if (typeof value === 'string') {
        console.log('Fetching rooms for hostel:', value); // Debug log
        const roomsData = await api.getRooms(value);
        console.log('Received rooms:', roomsData); // Debug log
        setRooms(roomsData);
        setSelectedRoom('');
      }
    };
  
    return {
      routes,
      stops,
      hostels,
      rooms,
      selectedTransport,
      selectedRoute,
      selectedStop,
      selectedHostel,
      selectedRoom,
      handleTransportAcademicYearChange,
      handleTransportChange,
      handleRouteChange,
      handleHostelChange,
      handleHostelNameChange,
      currentAcademicYear,
    };
  };
  
  export default useTransportHostelForm;