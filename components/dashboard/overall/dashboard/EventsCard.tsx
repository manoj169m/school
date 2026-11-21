"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPinCheck,  } from "lucide-react";

interface Event {
  id: number;
  eventName: string;
  locationName: string;
  date: string;
  startTime: string;
  endTime: string;
  organizerName: string;
  description: string;
  type: string;
}

// Color variants for event cards
const colorVariants = [
  {
    border: "border-red-500",
    hover: "hover:bg-red-500",
    text: "text-red-500",
    time: "text-red-300",
    hoverText: "group-hover:text-red-200",
    icon: "text-red-500",
    iconHover: "group-hover:text-red-200",
  },
 
  {
    border: "border-teal-500",
    hover: "hover:bg-teal-500",
    text: "text-teal-500",
    hoverText: "group-hover:text-teal-200",
    time: "text-teal-300",
    icon: "text-teal-500",
    iconHover: "group-hover:text-teal-200",
  },
  {
    border: "border-orange-500",
    hover: "hover:bg-orange-500",
    text: "text-orange-500",
    time: "text-orange-300",
    hoverText: "group-hover:text-orange-200",
    icon: "text-orange-500",
    iconHover: "group-hover:text-orange-200",
  },
];

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events/overall");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        // Sort events by date and take only upcoming events
        const upcomingEvents = data
          .filter((event: Event) => new Date(event.date) >= new Date())
          .sort(
            (a: Event, b: Event) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 4); // Take only the first 4 upcoming events
        setEvents(upcomingEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const dayName = date.toLocaleString("default", { weekday: "long" });
    return { day, month, dayName };
  };

  const formatTimeToAMPM = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <p>Loading events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32 text-red-500">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="scroll-container flex gap-1 overflow-x-auto pb-4">
            {events.map((event, index) => {
              const colors = colorVariants[index % colorVariants.length];
              const { day, month, dayName } = formatDate(event.date);

              return (
                <div
                  key={event.id}
                  className={`flex flex-col w-48 bg-white text-black border-l-2 ${colors.border} transition-all ${colors.hover} hover:text-white hover:shadow-lg group`}
                >
                  <div className="mt-4 ml-4">
                    <span className="flex items-center font-semibold gap-2">
                      <MapPinCheck
                        className={`w-12 h-12 ${colors.icon} ${colors.iconHover} transition-all`}
                      />
                      <span className="text-black text-base mr-6 group-hover:text-white transition-all">
                        {event.locationName}
                      </span>
                    </span>
                    <span
                      className={`block text-sm font-semibold mb-2 2xl:mt-16 mt-10 ${colors.text} ${colors.hoverText} transition-all`}
                    >
                      {dayName}
                    </span>
                    <h1
                      className={`block text-3xl font-bold ${colors.text} group-hover:text-white transition-all`}
                    >
                      {day} <span className="block">{month}</span>
                    </h1>
                    <span className="flex items-center font-semibold gap-2">
                      <Clock
                        className={`w-4 h-4 ${colors.icon} ${colors.iconHover} transition-all`}
                      />
                      <span
                        className={`${colors.time} text-sm  group-hover:text-white transition-all`}
                      >
                        {formatTimeToAMPM(event.startTime)} -{" "}
                        {formatTimeToAMPM(event.endTime)}
                      </span>
                    </span>
                    <span className="block  text-sm mt-1 font-semibold text-slate-600 group-hover:text-white transition-all">
                      {event.eventName}
                    </span>

                    <span className="flex items-center 2xl:mt-16 mt-10 gap-2">
                      <span
                        className={`${colors.text}   mb-5 text-base font-bold group-hover:text-white transition-all`}
                      >
                        Incharger: {event.organizerName}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
