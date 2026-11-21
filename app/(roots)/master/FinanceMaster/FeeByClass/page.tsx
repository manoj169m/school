import { Breadcrumbs } from "@/components/breadcrumbs";
import FeeByClass from "@/components/master/financeMaster/feeByClass/FeebyForm";
import React from "react";

const breadcrumbItems = [
  { title: "Finance Master", link: "/" },
  { title: "Fee by class", link: "/master/FinanceMaster/FeeByClass" },
];


function page() {
    return (
      <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
            <p className="text-gray-800 text-2xl font-bold mb-2">
                Here&apos;s a list of Fee by class!
            </p>
          <div className="gradient-text text-4xl font-extrabold">
           
          </div>
        </div>
        <div>
          <Breadcrumbs items={breadcrumbItems}/>
        </div>
       
      </div>
     
        <FeeByClass/>
      
    </div>
    );
  }
  
  export default page;