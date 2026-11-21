"use client";
import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronsRight, MapPinCheck } from "lucide-react";
import EventDialog from "../dialog/eventDetails";

export function UpcomingEvents() {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const handleOpenEventDialog = () => {
    setIsEventDialogOpen(true);
  };

  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="scroll-container flex gap-1 overflow-x-auto">
            {/* Diwali Celebration Event Box */}
            <div className="flex flex-col w-48 bg-white text-black border-l-2 border-red-500 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg group">
              <div className="mt-4 ml-4">
                <span className="flex items-center font-semibold gap-2">
                  <MapPinCheck className="w-4 h-4 text-red-500 group-hover:text-red-300 transition-all" />
                  <span className="text-black mr-10 group-hover:text-white transition-all">
                    Location
                  </span>
                </span>
                <span className="block text-sm font-semibold mt-14 text-red-600 group-hover:text-red-300 transition-all">
                  Thursday
                </span>
                <h1 className="block text-3xl font-bold text-red-500 group-hover:text-white transition-all">
                  09 <span className="block">Dec</span>
                </h1>
                <span className="block text-sm font-semibold text-slate-600 group-hover:text-red-300 transition-all">
                  Diwali Celebration
                </span>
                <button
                  onClick={handleOpenEventDialog}
                  className="mt-14 mb-5 text-lg text-red-500 font-semibold group-hover:text-white transition-all focus:outline-none flex items-center gap-1"
                >
                  View Details
                  <ChevronsRight className="w-5 h-5 text-red-500 group-hover:text-white transition-all" />
                </button>
              </div>
            </div>

            {/* Existing other event boxes... (unchanged from previous code) */}
            {/* Event Box 2 */}
            <div className="flex flex-col w-48  bg-white text-black border-l-2 border-yellow-500 transition-all hover:bg-yellow-500 hover:text-white hover:shadow-lg group">
              <div className="mt-4 ml-4">
                <span className="flex items-center font-semibold gap-2">
                  <MapPinCheck className="w-4 h-4 text-yellow-500 group-hover:text-yellow-100 transition-all" />
                  <span className="text-black mr-6 group-hover:text-white transition-all">
                    Auditorium
                  </span>
                </span>
                <span className="block text-sm font-semibold mt-14 text-yellow-600 group-hover:text-yellow-100 transition-all">
                  Wednesday
                </span>
                <h1 className="block text-3xl font-bold text-yellow-500 group-hover:text-white transition-all">
                  09 <span className="block">Dec</span>
                </h1>
                <span className="block text-sm font-semibold text-slate-600 group-hover:text-yellow-100 transition-all">
                  Sweet Distribution
                </span>
                <button className="mt-14 mb-5 text-lg text-yellow-500 font-semibold group-hover:text-white transition-all focus:outline-none flex items-center gap-1">
                  View Details
                  <ChevronsRight className="w-5 h-5 text-yellow-500 group-hover:text-white transition-all" />
                </button>
              </div>
            </div>

            {/* Event Box 3 */}
            <div className="flex flex-col w-48 bg-white text-black border-l-2 border-teal-500 transition-all hover:bg-teal-500 hover:text-white hover:shadow-lg group">
              <div className="mt-4 ml-4">
                <span className="flex items-center font-semibold gap-2">
                  <MapPinCheck className="w-4 h-4 text-teal-500 group-hover:text-teal-300 transition-all" />
                  <span className="text-black mr-6 group-hover:text-white transition-all">
                    Auditorium
                  </span>
                </span>
                <span className="block text-sm font-semibold mt-14 text-teal-500 group-hover:text-teal-300 transition-all">
                  Wednesday
                </span>
                <h1 className="block text-3xl font-bold text-teal-500 group-hover:text-white transition-all">
                  09 <span className="block">Dec</span>
                </h1>
                <span className="block text-sm font-semibold text-slate-600 group-hover:text-teal-300 transition-all">
                  Sweet Distribution
                </span>
                <button className="mt-14 mb-5 text-lg text-teal-500 font-semibold group-hover:text-white transition-all focus:outline-none flex items-center gap-1">
                  View Details
                  <ChevronsRight className="w-5 h-5 text-teal-500 group-hover:text-white transition-all" />
                </button>
              </div>
            </div>

            {/* Event Box 4 */}
            <div className="flex flex-col w-48 bg-white text-black border-l-2 border-orange-500 transition-all hover:bg-orange-500 hover:text-white hover:shadow-lg group">
              <div className="mt-4 ml-4">
                <span className="flex items-center font-semibold gap-2">
                  <MapPinCheck className="w-4 h-4 text-orange-500 group-hover:text-orange-300 transition-all" />
                  <span className="text-black mr-6 group-hover:text-white transition-all">
                    Auditorium
                  </span>
                </span>
                <span className="block text-sm font-semibold mt-14 text-orange-400 group-hover:text-orange-300 transition-all">
                  Wednesday
                </span>
                <h1 className="block text-3xl font-bold text-orange-500 group-hover:text-white transition-all">
                  09 <span className="block">Dec</span>
                </h1>
                <span className="block text-sm font-semibold text-slate-600 group-hover:text-orange-300 transition-all">
                  Sweet Distribution
                </span>
                <button className="mt-14 mb-5 text-lg text-orange-500 font-semibold group-hover:text-white transition-all focus:outline-none flex items-center gap-1">
                  View Details
                  <ChevronsRight className="w-5 h-5 text-orange-500 group-hover:text-white transition-all" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EventDialog Component */}
      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={handleCloseEventDialog}
      />
    </>
  );
}
