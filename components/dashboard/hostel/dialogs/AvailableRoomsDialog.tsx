'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getRoomsByFloor } from '@/lib/hostelDashboard/data/rooms';
import { motion } from 'framer-motion';

import { DoorClosed } from 'lucide-react';

interface AvailableRoomsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostelId: number;
}

export default function AvailableRoomsDialog({ open, onOpenChange, hostelId }: AvailableRoomsDialogProps) {
  const roomsByFloor = getRoomsByFloor(hostelId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white p-6">
        <DialogTitle className="text-3xl font-bold mb-6 text-center">
          Available Rooms
        </DialogTitle>

        <div className="space-y-6">
          {roomsByFloor.map(({ floor, rooms }) => (
            <motion.div
              key={floor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-300 rounded-lg p-4"
            >
              <h3 className="text-xl font-bold mb-4 text-black">Floor {floor}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {rooms.filter(room => !room.isOccupied).map((room) => (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-green-500 to-green-500 rounded-lg p-3 text-center"
                  >
                    <DoorClosed className="h-5 w-5 mx-auto mb-2 text-white" />
                    <p className="font-semibold  text-white">Room {room.number}</p>
                    <p className="text-sm text-green-100">{room.type}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}