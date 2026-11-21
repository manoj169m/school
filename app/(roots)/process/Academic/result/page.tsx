import ResultDetails from '@/components/process/academics/result/resultDetails';
import { Breadcrumbs } from "@/components/breadcrumbs";


export default function page() {
    
    const breadcrumbItems = [
      { title: "Process", link: "/" },
      { title: "Academics", link: "#" },
      { title: "Result OverView", link: "/process/AcademicMaster/resultEntry" },
    ];
    
 
      return (
        <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <p className="text-gray-800 text-2xl font-bold mb-2">
              Here&apos;s a list of Results!
              </p>
              <div className="gradient-text text-4xl font-extrabold"></div>
            </div>
            <div>
              <Breadcrumbs items={breadcrumbItems} />
            </div>
          </div>
          <div className="overflow-x-auto  p-6 ">
           <ResultDetails
           
           />
          </div>
        </div>
      );
    }
    
    