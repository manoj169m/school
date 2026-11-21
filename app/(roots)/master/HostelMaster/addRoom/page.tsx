import { Breadcrumbs } from '@/components/breadcrumbs'
import AddRoom from '@/components/master/hostelMaster/AddRoom/AddRoom'
import React from 'react'

export default function page() {
    const breadcrumbItems = [
        { title: "Master", link: "/" },
        { title: "Add Rooms", link: "/master/HostelMaster/addRooms" },
      ];
      
  return (
    <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
         <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <p className="text-gray-800 text-2xl font-bold mb-2">
            Here&apos;s a list of Hostel!
          </p>
          <div className="gradient-text text-4xl font-extrabold">
           
          </div>
        </div>
        <div>
          <Breadcrumbs items={breadcrumbItems}/>
        </div>
       
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">

      <AddRoom/>
      </div>
    </div>
  )
}
