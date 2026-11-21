'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Building2, DoorOpen } from 'lucide-react';
import AvailableRoomsDialog from './AvailableRoomsDialog';

interface RoomsDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Hostel {
  id: number;
  hostelName: string;
  floorCount: number;
  capacity: number;
  type: string;
  rooms: Room[];
}

interface Room {
  id: number;
  roomNumber: string;
  capacity: number;
  floorNumber: number;
  hostelId: number;
}

export default function RoomsDetailsDialog({ open, onOpenChange }: RoomsDetailsDialogProps) {
  const [selectedHostel, setSelectedHostel] = useState<string>('');
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
console.log(loading);

  // Fetch hostels on component mount
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await fetch('/api/hostels');
        if (!response.ok) throw new Error('Failed to fetch hostels');
        const data = await response.json();
        setHostels(data);
      } catch (err) {
        setError('Error loading hostels');
        console.error('Error:', err);
      }
    };
    fetchHostels();
  }, []);

  // Fetch rooms when hostel is selected
  useEffect(() => {
    if (!selectedHostel) return;

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/rooms/${selectedHostel}`);
        if (!response.ok) throw new Error('Failed to fetch rooms');
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError('Error loading rooms');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [selectedHostel]);

  const handleHostelChange = (value: string) => {
    setSelectedHostel(value);
  };

  const calculateStats = () => {
    if (!selectedHostel || !rooms.length) return null;

    const totalRooms = rooms.length;
    // You might want to modify this logic based on your actual occupancy tracking
    const occupiedRooms = rooms.filter(() => false).length; // Replace with actual occupancy check
    const availableRooms = totalRooms - occupiedRooms;
    const occupancyRate = `${((occupiedRooms / totalRooms) * 100).toFixed(1)}%`;

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate
    };
  };

  const stats = calculateStats();
  const selectedHostelData = hostels.find(h => h.id === parseInt(selectedHostel));

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl bg-white text-black p-6">
          <div className="text-red-500 text-center">{error}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white text-black p-6">
          <DialogTitle className="text-3xl font-bold mb-6 text-center">
            Room Management
          </DialogTitle>
          
          <div className="space-y-6">
            <Select value={selectedHostel} onValueChange={handleHostelChange}>
              <SelectTrigger className="w-full bg-white text-black border-gray-700">
                <SelectValue placeholder="Select a hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostels.map((hostel) => (
                  <SelectItem key={hostel.id} value={hostel.id.toString()}>
                    {hostel.hostelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AnimatePresence>
              {stats && selectedHostelData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-zinc-400 to-stone-500 transition-all duration-300 group rounded-lg p-6 shadow-xl"
                >
                  <h3 className="text-2xl font-bold mb-4">
                    {selectedHostelData.hostelName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                      icon={<Building2 className="h-6 w-6" />}
                      label="Total Rooms"
                      value={stats.totalRooms}
                    />
                    <StatsCard
                      icon={<DoorOpen className="h-6 w-6" />}
                      label="Occupied Rooms"
                      value={stats.occupiedRooms}
                    />
                    <div
                      onClick={() => setShowAvailableRooms(true)}
                      className="cursor-pointer hover:scale-105 transition-transform"
                    >
                      <StatsCard
                        icon={<DoorOpen className="h-6 w-6" />}
                        label="Available Rooms"
                        value={stats.availableRooms}
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">
                      Current Occupancy Rate: {stats.occupancyRate}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      <AvailableRoomsDialog
        open={showAvailableRooms}
        onOpenChange={setShowAvailableRooms}
        hostelId={parseInt(selectedHostel)}
      />
    </>
  );
}

function StatsCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white/30 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm text-gray-900">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}