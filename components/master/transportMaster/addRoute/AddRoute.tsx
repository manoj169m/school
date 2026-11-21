"use client";
import { useEffect, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AcademicYearOption } from "@/constant/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/app/loading";
import { RouteCreationFormValues } from "./sheetModel/SheetModel";

export default function RoutesPage() {
  const [data, setData] = useState([]); // Store route data
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]); // Store academic years data
  const [selectedYear, setSelectedYear] = useState(""); // Store selected academic year
  const [isLoading, setIsLoading] = useState(false); // Loading state for data fetching
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load state

  useEffect(() => {
    async function fetchAcademicYears() {
      try {
        const response = await fetch("/api/academicYears");
        if (!response.ok) throw new Error("Failed to fetch academic years");
        const result = await response.json();
        setAcademicYears(result);
      } catch (err) {
        console.error("Error fetching academic years:", err);
      }
    }

    fetchAcademicYears();
  }, []);

  useEffect(() => {
    async function fetchRoutes() {
      if (!selectedYear) return; // Only fetch if a year is selected

      setIsLoading(true);
      try {
        const url = `/api/routes?academicYearId=${selectedYear}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Failed to fetch routes");
        
        const result = await response.json();
        setData(result);
        
        // Reset initial load state after first manual selection
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      } catch (err) {
        console.error("Error fetching routes:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedYear) {
      fetchRoutes();
    }
  }, [selectedYear, isInitialLoad]);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const saveRoute = async (routeData: RouteCreationFormValues) => {
    try {
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...routeData, academicYearId: selectedYear }),
      });
      
      if (!response.ok) throw new Error("Failed to save route");
      
      const result = await response.json();
      console.log("Route saved:", result);
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };
console.log(saveRoute);

  return (
    <>
    <Card className="shadow-lg rounded-md border border-gray-200 mb-6">
    <CardHeader className="bg-sandle-100 items-center">
        <CardTitle className="text-custom-pink-300">Academic year</CardTitle>
    </CardHeader>
    <CardContent className="justify-items-center">
      <Select 
        value={selectedYear} 
        onValueChange={handleYearChange}

      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select Academic Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {academicYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      </CardContent>
      </Card>

      {selectedYear && (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loading/>
            </div>
          ) : (
            <DataTable 
              data={data} 
              columns={columns} 
            />
          )}
        </div>
      )}
    </>
  );
}
