import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface NavigationLink {
  href: string;
  label: string;
}

const AddStudent: React.FC = () => {
  const navigationLinks: NavigationLink[] = [
    {
      href: "/master/StudentMaster/addStudent/enquiry",
      label: "Enquiry",
    },
    {
      href: "/master/StudentMaster/addStudent/admission",
      label: "Admission",
    },
    {
      href: "/master/StudentMaster/addStudent/reservation",
      label: "Reservation",
    },
  ];

  return (
    
      <ScrollArea className="h-full w-full">
        <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center">
          <Card className="w-full max-w-4xl p-4">
            <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative flex w-full items-center rounded-md bg-custom-pink-300 px-4 py-3 text-white transition-all hover:bg-custom-red-600"
                >
                  <span className="flex-1 text-center text-lg">{link.label}</span>
                  <SquareArrowOutUpRight className="ml-2 h-5 w-5" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </ScrollArea>
   
  );
};

export default AddStudent;