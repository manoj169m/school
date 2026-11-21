import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { UserNav } from "./User-icon";
import { Notification } from "./Notification";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 p-8 shrink-0 text-gray-800 bg-custom-pink-300 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">

    <div className="flex items-center gap-2">
      <SidebarTrigger className="-ml-1 h-10 w-8 text-white" />
      <Separator orientation="vertical" className="mr-2 h-4" />
    </div>
  
    <div className="flex items-center gap-2">
      <div>
        {/* For screens below 640px */}
        <h1 className="text-white font-bold text-md block sm:hidden cursor-pointer">
          ABC SCHOOL
        </h1>
        {/* For screens 640px and above */}
        <h1 className="text-white font-bold text-md hidden sm:block cursor-pointer">
          ABC International School
        </h1>
      </div>
      <Separator orientation="vertical" className="mr-2 h-4" />
    </div>
  
    {/* Right side: Notification button and avatar */}
    <div className="flex items-center gap-4">
      <Notification />
      <UserNav />
    </div>
  </header>
  );
}
