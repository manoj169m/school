import { Breadcrumbs } from "@/components/breadcrumbs";
import BulkUploadTemplate from "@/components/master/studentMaster/bulkUpload/BulkUploadTemplate";
import { StudentBulkUpload } from "@/components/master/studentMaster/bulkUpload/uploadStudent";
import { Sheet } from "lucide-react";

import React from "react";

const breadcrumbItems = [
  { title: "Master", link: "/" },
  { title: "Students Master", link: "/master/StudentMaster" },
  { title: "Bulk Upload", link: "/master/StudentMaster/bulkUploadStudents" },
];

function Page() {
  return (
    <div className="h-full flex flex-col p-6 md:p-8 space-y-8 bg-custom-pink-50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Sheet className="text-custom-pink-300 mr-2" />
            Bulk Upload Student Details
          </h1>
          <p className="text-gray-600 text-lg">
            Easily upload multiple student details using the provided template.
          </p>
        </div>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Main Content - Split Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section - Upload Component */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-custom-pink-300">
          
          <StudentBulkUpload />
        
        </div>

        {/* Right Section - Guidelines */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-custom-pink-300">
          <h2 className="text-xl font-semibold text-custom-red-600 mb-4">
            Excel Upload Format Guidelines
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>
              <strong className="text-custom-pink-200">File Types:</strong> .xlsx, .xls, or .csv
            </li>
            <li>
              <strong  className="text-custom-pink-200">First Row:</strong> Headers must match schema fields.
            </li>
            <li>
              <strong className="text-custom-pink-200">Mandatory Fields:</strong> Include all required fields:
              <ul className="list-disc pl-6 mt-2 text-sm">
                <li>firstName, lastName, gender (MALE/FEMALE/OTHER)</li>
                <li>dateOfBirth (YYYY-MM-DD), email, country, state</li>
                <li>cityTownVillage, address, communicationNo, phoneNo</li>
                <li>relationName1, relationType1, relationNo1</li>
                <li>academicYear, branch, joinYear, dateOfJoin</li>
                <li>classJoin, class, section, admissionNo, feeCategory</li>
              </ul>
            </li>
            <li>
              <strong className="text-custom-pink-200">Optional Fields:</strong> Include if applicable:
              <ul className="list-disc pl-6 mt-2 text-sm">
                <li>  community, caste, bloodGroup, motherTongue</li>
                <li>religion, aadharNo, emisNo, placeOfBirth</li>
                <li>applicationNo, rollNo, relationName2, relationType2</li>
                <li>relationNo2, transport, hostel</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Full-Width Table Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-custom-pink-300">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Example Excel Template:
        </h3>
        <div className="overflow-x-auto border border-custom-pink-100 rounded-lg p-4 ">
          <table className="table-auto w-full text-sm text-left text-gray-700">
            <thead className="bg-custom-pink-300 text-white font-semibold">
              <tr>
                <th className="px-4 py-2">firstName</th>
                <th className="px-4 py-2">lastName</th>
                <th className="px-4 py-2">gender</th>
                <th className="px-4 py-2">dateOfBirth</th>
                <th className="px-4 py-2">country</th>
                <th className="px-4 py-2">state</th>
                <th className="px-4 py-2">cityTownVillage</th>
                <th className="px-4 py-2">address</th>
                <th className="px-4 py-2">communicationNo</th>
                <th className="px-4 py-2">phoneNo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-custom-pink-100 hover:bg-gray-50 transition">
                <td className="px-4 py-2">John</td>
                <td className="px-4 py-2">Doe</td>
                <td className="px-4 py-2">MALE</td>
                <td className="px-4 py-2">2005-06-15</td>
                <td className="px-4 py-2">India</td>
                <td className="px-4 py-2">Tamil Nadu</td>
                <td className="px-4 py-2">Chennai</td>
                <td className="px-4 py-2">123 Main St</td>
                <td className="px-4 py-2">9876543210</td>
                <td className="px-4 py-2">9876543210</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <BulkUploadTemplate/>
    </div>
     
  );
}

export default Page;
