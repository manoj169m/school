"use client";

import { useEffect, useState } from "react";
import { Bus, Users, MapPin, CreditCard } from "lucide-react";
import { StatsCard } from "./stats-card";
interface TransportStats {
  totalStudents: number;
  totalRoutes: number;
  totalStops: number;
  totalFees: number;
}

interface DashboardHeaderProps {
  branchId: number | "all"; // Updated type to be more specific
}

async function fetchTransportStats(
  branchId: number | "all"
): Promise<TransportStats> {
  try {
    // First get current academic year
    const currentYearResponse = await fetch("/api/academicYears/current");
    if (!currentYearResponse.ok) {
      throw new Error("Failed to fetch current academic year");
    }
    const currentYear = await currentYearResponse.json();

    // Get transport data using both academic year ID and branch ID
    const statsUrl = `/api/transport/stats/${currentYear.id}${
      branchId !== "all" ? `?branchId=${branchId}` : ""
    }`;

    const statsResponse = await fetch(statsUrl);
    if (!statsResponse.ok) {
      throw new Error("Failed to fetch transport stats");
    }
    const stats = await statsResponse.json();

    return stats;
  } catch (error) {
    console.error("Error fetching transport stats:", error);
    return {
      totalStudents: 0,
      totalRoutes: 0,
      totalStops: 0,
      totalFees: 0,
    };
  }
}

export function DashboardHeader({ branchId }: DashboardHeaderProps) {
  const [stats, setStats] = useState<TransportStats>({
    totalStudents: 0,
    totalRoutes: 0,
    totalStops: 0,
    totalFees: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      setIsLoading(true);
      try {
        const transportStats = await fetchTransportStats(branchId);
        setStats(transportStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getStats();
  }, [branchId]);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={isLoading ? "..." : stats.totalStudents}
          icon={Users}
          description={`${
            branchId === "all" ? " across all branches" : " in this branch"
          }`}
          color="bg-rose-100"
        />
        <StatsCard
          title="Active Routes"
          value={isLoading ? "..." : stats.totalRoutes}
          icon={Bus}
          description="Operating transport routes"
          color="bg-purple-100"
        />
        <StatsCard
          title="Bus Stops"
          value={isLoading ? "..." : stats.totalStops}
          icon={MapPin}
          description="Designated bus stops"
          color="bg-blue-100"
        />
        {/* <BusRoutesManager/> */}
        <StatsCard
          title="Total Fees"
          value={isLoading ? "..." : `₹${stats.totalFees.toLocaleString()}`}
          icon={CreditCard}
          description="Annual transport fees"
          color="bg-green-100"
        />
      </div>
    </div>
  );
}
