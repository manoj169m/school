import { useState, useEffect, useCallback } from "react";

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

interface TransportDetails {
  transportAssignment: {
    routeId: number;
    stopId: number;
    academicYearId: number;
  } | null;
}

interface HostelDetails {
  hostelAssignment: {
    hostelId: number;
    roomId: number;
  } | null;
}

// API functions with caching
const api = {
  async getRoutes(academicYearId: string): Promise<Route[]> {
    try {
      const response = await fetch(`/api/adminroutes/${academicYearId}`);
      if (!response.ok) throw new Error("Failed to fetch routes");
      return await response.json();
    } catch (error) {
      console.error("Error fetching routes:", error);
      return [];
    }
  },

  async getStops(routeId: string): Promise<Stop[]> {
    try {
      const response = await fetch(`/api/stops/${routeId}`);
      if (!response.ok) throw new Error("Failed to fetch stops");
      return await response.json();
    } catch (error) {
      console.error("Error fetching stops:", error);
      return [];
    }
  },

  async getHostels(): Promise<Hostel[]> {
    try {
      const response = await fetch("/api/hostels");
      if (!response.ok) throw new Error("Failed to fetch hostels");
      return await response.json();
    } catch (error) {
      console.error("Error fetching hostels:", error);
      return [];
    }
  },

  async getRooms(hostelId: string): Promise<Room[]> {
    try {
      const response = await fetch(`/api/rooms/${hostelId}`);
      if (!response.ok) throw new Error("Failed to fetch rooms");
      return await response.json();
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  },
};

interface UseTransportHostelUpdateFormProps {
  initialTransportStatus?: string;
  initialHostelStatus?: string;
  transportDetails?: TransportDetails;
  hostelDetails?: HostelDetails;
  academicYearId?: string;
}

export const useTransportHostelUpdateForm = ({
  initialTransportStatus = "NotUsing",
  initialHostelStatus = "NotUsing",
  transportDetails,
  hostelDetails,
  academicYearId = "",
}: UseTransportHostelUpdateFormProps) => {
  // Form states with initial values
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [currentAcademicYear, setCurrentAcademicYear] =
    useState(academicYearId);
  const [selectedTransport, setSelectedTransport] = useState(
    initialTransportStatus
  );
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedHostel, setSelectedHostel] = useState(initialHostelStatus);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized fetch functions
  const fetchRoutes = useCallback(async (yearId: string) => {
    const routesData = await api.getRoutes(yearId);
    setRoutes(routesData);
    return routesData;
  }, []);

  const fetchStops = useCallback(async (routeId: string) => {
    const stopsData = await api.getStops(routeId);
    setStops(stopsData);
    return stopsData;
  }, []);

  const fetchHostels = useCallback(async () => {
    const hostelsData = await api.getHostels();
    setHostels(hostelsData);
    return hostelsData;
  }, []);

  const fetchRooms = useCallback(async (hostelId: string) => {
    const roomsData = await api.getRooms(hostelId);
    setRooms(roomsData);
    return roomsData;
  }, []);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (isInitialized) return;

      try {
        if (
          initialTransportStatus === "Using" &&
          transportDetails?.transportAssignment
        ) {
          const { academicYearId, routeId } =
            transportDetails.transportAssignment;
          setCurrentAcademicYear(academicYearId.toString());

          // Fetch routes
          await fetchRoutes(academicYearId.toString());
          setSelectedRoute(routeId.toString());

          // Fetch stops
          await fetchStops(routeId.toString());
        }

        if (
          initialHostelStatus === "Using" &&
          hostelDetails?.hostelAssignment
        ) {
          const { hostelId } = hostelDetails.hostelAssignment;

          // Fetch hostels
          await fetchHostels();
          setSelectedHostel("Using");

          // Fetch rooms
          await fetchRooms(hostelId.toString());
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, [
    isInitialized,
    initialTransportStatus,
    initialHostelStatus,
    transportDetails,
    hostelDetails,
    fetchRoutes,
    fetchStops,
    fetchHostels,
    fetchRooms,
  ]);

  // Handlers
  const handleTransportAcademicYearChange = useCallback(
    async (value: string) => {
      setCurrentAcademicYear(value);
      if (selectedTransport === "Using") {
        await fetchRoutes(value);
        setSelectedRoute("");
        setStops([]);
      }
    },
    [selectedTransport, fetchRoutes]
  );

  const handleTransportChange = useCallback(
    async (value: string) => {
      setSelectedTransport(value);

      if (value === "Using" && currentAcademicYear) {
        await fetchRoutes(currentAcademicYear);
      } else {
        setSelectedRoute("");
        setRoutes([]);
        setStops([]);
      }
    },
    [currentAcademicYear, fetchRoutes]
  );

  const handleRouteChange = useCallback(
    async (value: string) => {
      setSelectedRoute(value);
      if (value) {
        await fetchStops(value);
      }
    },
    [fetchStops]
  );

  const handleHostelChange = useCallback(
    async (value: string) => {
      setSelectedHostel(value);
      if (value === "Using") {
        await fetchHostels();
      } else {
        setHostels([]);
        setRooms([]);
      }
    },
    [fetchHostels]
  );

  const handleHostelNameChange = useCallback(
    async (value: string) => {
      if (value) {
        await fetchRooms(value);
      }
    },
    [fetchRooms]
  );

  return {
    // State
    routes,
    stops,
    hostels,
    rooms,
    selectedTransport,
    selectedRoute,
    selectedHostel,
    // Handlers
    handleTransportAcademicYearChange,
    handleTransportChange,
    handleRouteChange,
    handleHostelChange,
    handleHostelNameChange,
    isInitialized,
  };
};

export default useTransportHostelUpdateForm;
