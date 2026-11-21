"use client";

import { useState, useEffect } from "react";
import { EventCard } from "./event-card";
import { EventDetailsDialog } from "./event-details-dialog";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Branch {
  id: number;
  acronym: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  type: "cultural" | "sports" | "academic";
  branchId: number | null;
  branchName: string | null;
  incharger: {
    name: string;
    designation: string;
    imageUrl: string;
  };
  imageUrl: string;
}

export function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/dashboard/events?branchId=${selectedBranch}`
        );
        const data = await response.json();

        // Define image URLs based on event type
        const eventImages = {
          cultural:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop",
          sports:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
          academic:
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
        };

        const profileImages = {
          cultural:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
          sports:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
          academic:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
        };

        const eventsWithImages = data.map((event: Event) => ({
          ...event,
          imageUrl: event.imageUrl || eventImages[event.type],
          incharger: {
            ...event.incharger,
            imageUrl: event.incharger.imageUrl || profileImages[event.type],
          },
        }));
        setEvents(eventsWithImages);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [selectedBranch]);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold text-rose-950 mb-2">
            Upcoming Events
          </h2>
          <p className="text-rose-600">
            Stay updated with our upcoming celebrations and events
          </p>
        </motion.div>

        <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg">
          <Building2 className="h-5 w-5 text-rose-500" />
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[200px] border-rose-200 bg-white">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.acronym}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 ">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
        </div>
      ) : (
        <div className=" mt-5 overflow-x-auto">
          <div className="flex gap-6 flex-nowrap">
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="w-80 h-80 flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <EventCard
                  name={event.name}
                  date={event.date}
                  location={event.location}
                  imageUrl={event.imageUrl}
                  type={event.type}
                  onClick={() => setSelectedEvent(event)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {selectedEvent && (
        <EventDetailsDialog
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
