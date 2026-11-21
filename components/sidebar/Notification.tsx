import { BellRing } from "lucide-react";

export function Notification() {
  return (
    <div className=" p-2 rounded-xl py-3 px-3 flex">
      <button className="relative text-white hover:text-custom-red-600 items-center focus:outline-none">
        <BellRing className="w-6 h-6" /> {/* Notification icon */}
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500"></span>{" "}
        {/* Notification badge */}
      </button>
    </div>
  );
}
