// components/dashboard/transport/TransportOverview.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Bus } from "lucide-react";
import { useEffect, useState } from "react";

interface TransportData {
  buses: number;
  routes: number;
  totalStudents: number;
}

export function TransportOverview() {
  const [transport, setTransport] = useState<TransportData>({
    buses: 0,
    routes: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransport() {
      try {
        setLoading(true);
        const response = await fetch("/api/transport/transport-overview");

        if (!response.ok) {
          throw new Error("Failed to fetch transport data");
        }

        const data = await response.json();
        setTransport(data);
        console.log("Transport data:", data);
      } catch (error) {
        console.error("Error fetching transport data:", error);
        setError("Failed to load transport data");
      } finally {
        setLoading(false);
      }
    }

    fetchTransport();
  }, []);

  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10">
        <div className="text-center text-red-600">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10">
      <h3 className="font-semibold flex items-center gap-2 mb-4">
        <Bus className="h-4 w-4" />
        Transport Overview
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white/50 rounded-lg hover:scale-105 transition-transform">
          <p className="text-sm text-muted-foreground">Total Buses</p>
          <p className="text-2xl font-bold">
            {loading ? "..." : transport.buses}
          </p>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-lg hover:scale-105 transition-transform">
          <p className="text-sm text-muted-foreground">Routes</p>
          <p className="text-2xl font-bold">
            {loading ? "..." : transport.routes}
          </p>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-lg hover:scale-105 transition-transform">
          <p className="text-sm text-muted-foreground">Students</p>
          <p className="text-2xl font-bold">
            {loading ? "..." : transport.totalStudents}
          </p>
        </div>
      </div>
    </Card>
  );
}
