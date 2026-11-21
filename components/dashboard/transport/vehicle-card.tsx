"use client";

import { useState, useEffect } from "react";
import { Bus, Phone, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface Vehicle {
  id: number;
  vehicleNumber: string;
  driverName: string;
  contactNumber: string;
  capacity: number;
}

interface VehicleCardProps {
  branchId: number | "all";
  branchName?: string;
}

export function VehicleCard({
  branchId = "all",
  branchName = "",
}: VehicleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        // Reset vehicles when switching branches
        setVehicles([]);

        const url = `/api/vehicles/all-vehicles${
          branchId !== "all" ? `?branchId=${branchId}` : ""
        }`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const data = await response.json();
        if (data.vehicles) {
          setVehicles(data.vehicles);
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [branchId]);

  if (error) {
    return (
      <Card className="bg-red-100">
        <CardContent className="p-6">
          <p className="text-red-600">Error loading vehicles: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-rose-400 to-red-500 text-primary-foreground hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                Total Vehicles
              </CardTitle>
              <Bus className="h-8 w-8" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {isLoading ? "..." : vehicles.length}
              </div>
              <p className="text-sm text-primary-foreground/80 mt-2">
                {branchId === "all" ? (
                  " All Branches"
                ) : (
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-white/90">
                      {branchName}
                    </span>
                  </div>
                )}{" "}
                - {""}
                Click to view details
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600 mb-4">
            Vehicle Details -{" "}
            {branchId === "all" ? " All Branches" : `${branchName}`}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {isLoading ? (
            <p className="text-center py-4">Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No vehicles found
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-card hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-semibold text-primary">
                        Bus No: {vehicle.vehicleNumber}
                      </CardTitle>
                      <Bus className="h-6 w-6 text-red-600" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-semibold">Driver:</span>
                        <span>{vehicle.driverName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4" />
                        <span>{vehicle.contactNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {vehicle.capacity} seats</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
