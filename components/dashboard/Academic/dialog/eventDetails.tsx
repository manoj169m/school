
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";


interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventDialog({ isOpen, onClose }: EventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] md:max-w-4xl p-0 rounded-xl shadow-2xl bg-white flex flex-col max-h-[90vh] overflow-hidden">
        {/* Dialog header with gradient background */}
        <div className="bg-gradient-to-r from-custom-pink-300 to-custom-pink-200 p-4 md:p-6 rounded-t-xl flex-shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-white" />
              <DialogTitle className="text-xl md:text-2xl font-semibold text-white">
                Event Details
              </DialogTitle>
            </div>
            <DialogDescription className="text-custom-sandle-100 text-sm md:text-base">
              Detailed information about the event
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Event Details Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-8">
              {/* Left Column */}
              <div className="space-y-4 md:space-y-6">
                {/* Event Name */}
                <div className="bg-custom-sandle-100 p-3 md:p-4 rounded-lg border border-custom-pink-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-custom-pink-400" />
                    <span className="text-custom-pink-400 font-medium text-sm md:text-base">
                      Event Name
                    </span>
                  </div>
                  <div className="pl-6 md:pl-8 text-gray-700 text-sm md:text-base">
                    Diwali celebration
                  </div>
                </div>

                {/* Event Date */}
                <div className="bg-custom-sandle-100 p-3 md:p-4 rounded-lg border border-custom-pink-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-custom-pink-400" />
                    <span className="text-custom-pink-400 font-medium text-sm md:text-base">
                      Event Date
                    </span>
                  </div>
                  <div className="pl-6 md:pl-8 text-gray-700 text-sm md:text-base">
                    09/12/2024
                  </div>
                </div>

                {/* Event Time */}
                <div className="bg-custom-sandle-100 p-3 md:p-4 rounded-lg border border-custom-pink-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-custom-pink-400" />
                    <span className="text-custom-pink-400 font-medium text-sm md:text-base">
                      Event Time
                    </span>
                  </div>
                  <div className="pl-6 md:pl-8 text-gray-700 text-sm md:text-base">
                    11.30 AM
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 md:space-y-6">
                {/* Location */}
                <div className="bg-custom-sandle-100 p-3 md:p-4 rounded-lg border border-custom-pink-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-custom-pink-400" />
                    <span className="text-custom-pink-400 font-medium text-sm md:text-base">
                      Location
                    </span>
                  </div>
                  <div className="pl-6 md:pl-8 text-gray-700 text-sm md:text-base">
                    Auditorium
                  </div>
                </div>

                {/* Event Incharger Name */}
                <div className="bg-custom-sandle-100 p-3 md:p-4 rounded-lg border border-custom-pink-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-custom-pink-400" />
                    <span className="text-custom-pink-400 font-medium text-sm md:text-base">
                      Event Incharger Name
                    </span>
                  </div>
                  <div className="pl-6 md:pl-8 text-gray-700 text-sm md:text-base">
                    Ms. Getciya S
                  </div>
                </div>

                {/* Event Description */}
                <div className="bg-custom-sandle-100 p-3 md:p-4 rounded-lg border border-custom-pink-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-custom-pink-400" />
                    <span className="text-custom-pink-400 font-medium text-sm md:text-base">
                      Event Description
                    </span>
                  </div>
                  <div className="pl-6 md:pl-8 text-gray-700 text-sm md:text-base">
                    We are conducting diwali celabration on coming Tuesday.
                    Student must asseble the auditorium by 11 o clk.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog buttons */}
        <div className="flex justify-end gap-4 p-4 md:p-6 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4 md:px-6 border-custom-pink-300 text-custom-pink-300 hover:bg-custom-pink-50 text-sm md:text-base"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EventDialog;
