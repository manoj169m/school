'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Building, Users } from 'lucide-react';
import Loading from '@/app/loading';

interface Hostel {
  id: string;
  hostelName: string;
  floorCount: number;
  capacity: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface HostelDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HostelDetailsDialog({ open, onOpenChange }: HostelDetailsDialogProps) {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hostels`);
        if (!response.ok) {
          throw new Error('Failed to fetch hostels');
        }
        const data = await response.json();
        setHostels(data);
        setError(null);
      } catch (err) {
        setError('Error loading hostel data');
        console.error('Error fetching hostels:', err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchHostels();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white p-6">
        <DialogTitle className="text-3xl font-bold mb-6 text-center">
          Hostel Details
        </DialogTitle>

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostels.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function HostelCard({ hostel }: { hostel: Hostel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-purple-200 to-violet-300 hover:from-purple-300 hover:to-violet-400 transition-all duration-300 group rounded-lg p-6 shadow-xl"
    >
      <h3 className="text-2xl font-bold mb-4">{hostel.hostelName}</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <span>Floors: {hostel.floorCount}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Capacity: {hostel.capacity}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <span>Type: {hostel.type}</span>
        </div>
      </div>
    </motion.div>
  );
}