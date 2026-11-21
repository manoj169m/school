import { Breadcrumbs } from "@/components/breadcrumbs";
import Grade from "@/components/master/academicMaster/grade/Grade";

const breadcrumbItems = [
  { title: "Master", link: "/" },
  { title: "Add Grade", link: "/master/AcademicMaster/grade" },
];

export default function Page() {
  return (
    <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <p className="text-gray-800 text-2xl font-bold mb-2">
            Here&apos;s a list of Grades
          </p>
          <div className="gradient-text text-4xl font-extrabold"></div>
        </div>
        <div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <div className="overflow-x-auto  rounded-lg  ">
        <Grade/>
\      </div>
    </div>
  );
}
