import React, { ReactNode } from "react";
import { SidebarInset } from "../ui/sidebar";
import Navbar from "./Navbar";

export default function Content({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full overflow-x-hidden">
    {/* Navbar at the top */}
    <Navbar />

    {/* Main content with SidebarInset */}
    <div className="flex flex-grow ">
      <SidebarInset>
        {children}
      </SidebarInset>
    </div>
  </div>
  );
}
