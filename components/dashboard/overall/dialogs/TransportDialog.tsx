"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Bus, MapPin, User, Clock } from "lucide-react";

interface TransportDialogProps {
  type: 'buses' | 'routes' | 'students';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransportDialog({ type, open, onOpenChange }: TransportDialogProps) {
  const busDetails = [
    { number: "KA01F1001", driver: "Mr. Ramesh Kumar", capacity: 50, route: "Route 1" },
    { number: "KA01F1002", driver: "Mr. Suresh Singh", capacity: 50, route: "Route 2" },
    { number: "KA01F1003", driver: "Mr. John D'Souza", capacity: 50, route: "Route 3" },
    { number: "KA01F1004", driver: "Mr. David Wilson", capacity: 50, route: "Route 4" },
    { number: "KA01F1005", driver: "Mr. Rajesh Patel", capacity: 50, route: "Route 5" },
    { number: "KA01F1006", driver: "Mr. Michael Brown", capacity: 50, route: "Route 6" },
    { number: "KA01F1007", driver: "Mr. Sanjay Gupta", capacity: 50, route: "Route 7" },
    { number: "KA01F1008", driver: "Mr. Peter Smith", capacity: 50, route: "Route 8" },
    { number: "KA01F1009", driver: "Mr. Vijay Kumar", capacity: 50, route: "Route 9" },
    { number: "KA01F1010", driver: "Mr. Robert Davis", capacity: 50, route: "Route 10" },
    { number: "KA01F1011", driver: "Mr. Anil Sharma", capacity: 50, route: "Route 11" },
    { number: "KA01F1012", driver: "Mr. James Wilson", capacity: 50, route: "Route 12" },
    { number: "KA01F1013", driver: "Mr. Rahul Verma", capacity: 50, route: "Route 13" },
    { number: "KA01F1014", driver: "Mr. Thomas Brown", capacity: 50, route: "Route 14" },
    { number: "KA01F1015", driver: "Mr. Prakash Rao", capacity: 50, route: "Route 15" },
  ];

  const routeDetails = [
    {
      name: "Route 1",
      startPoint: "City Center",
      endPoint: "School",
      stops: ["Stop A", "Stop B", "Stop C"],
      timing: "7:30 AM - 8:30 AM",
      distance: "12 km",
    },
    {
      name: "Route 2",
      startPoint: "West End",
      endPoint: "School",
      stops: ["Stop X", "Stop Y", "Stop Z"],
      timing: "7:45 AM - 8:45 AM",
      distance: "15 km",
    },
    // Add more routes as needed
  ];

  const studentTransport = [
    {
      name: "John Doe",
      class: "10th A",
      busNumber: "KA01F1001",
      stop: "Stop A",
      pickup: "7:30 AM",
      dropoff: "4:00 PM",
    },
    {
      name: "Jane Smith",
      class: "8th B",
      busNumber: "KA01F1002",
      stop: "Stop X",
      pickup: "7:45 AM",
      dropoff: "4:15 PM",
    },
    // Add more students as needed
  ];

  const renderContent = () => {
    switch (type) {
      case 'buses':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {busDetails.map((bus) => (
              <Card key={bus.number} className="p-4 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Bus className="h-4 w-4 text-blue-500 group-hover:rotate-12 transition-transform" />
                      {bus.number}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Driver: {bus.driver}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Capacity: {bus.capacity}</p>
                    <p className="text-sm text-muted-foreground">{bus.route}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'routes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routeDetails.map((route) => (
              <Card key={route.name} className="p-4 hover:shadow-lg transition-all duration-300 group">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                  {route.name}
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">From:</span> {route.startPoint}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">To:</span> {route.endPoint}
                  </p>
                  <div className="text-sm">
                    <span className="font-medium">Stops:</span>
                    <div className="ml-4 mt-1">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="text-muted-foreground">{stop}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{route.timing}</span>
                    <span>{route.distance}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'students':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentTransport.map((student, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
                      {student.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{student.class}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{student.busNumber}</p>
                    <p className="text-muted-foreground">{student.stop}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-green-500" />
                    <span>Pickup: {student.pickup}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <span>Drop: {student.dropoff}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
    }
  };

  const getDialogTitle = () => {
    switch (type) {
      case 'buses':
        return 'School Bus Details';
      case 'routes':
        return 'Transport Routes';
      case 'students':
        return 'Student Transport Details';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}