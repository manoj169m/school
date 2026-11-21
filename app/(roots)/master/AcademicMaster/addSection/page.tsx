import { Breadcrumbs } from "@/components/breadcrumbs";
import AddSection from "@/components/master/academicMaster/addSection/AddSection";



const breadcrumbItems = [
  { title: "Student", link: "/" },
  { title: "Add Section", link: "/master/AcademicMaster/addSection" },
];

export default function Page() {
    return (
      <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <p className="text-gray-800 text-2xl font-bold mb-2">
            Here&apos;s a list of Sections
          </p>
          <div className="gradient-text text-4xl font-extrabold">
           
          </div>
        </div>
        <div>
          <Breadcrumbs items={breadcrumbItems}/>
        </div>
       
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
<AddSection/>
      </div>
    </div>
    );
  }
  