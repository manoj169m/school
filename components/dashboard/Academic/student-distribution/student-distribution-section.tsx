"use client";

import { useState, useEffect } from "react";
import { DistributionCard } from "./distribution-card";
import { DistributionDetailsDialog } from "./distribution-details-dialog";
import { Home, Bus, GraduationCap, BusFront } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DistributionType = "hostel" | "transport" | "dayScholar";

type Distribution = {
  hostel: {
    total: number;
    boys: number;
    girls: number;
  };
  transport: {
    total: number;
    boys: number;
    girls: number;
    routes: number;
  };
  dayScholar: {
    total: number;
    boys: number;
    girls: number;
  };
};

type AcademicYear = {
  id: number;
  label: string;
  isCurrentYear: boolean;
};

export function StudentDistributionSection() {
  const [selectedType, setSelectedType] = useState<DistributionType | null>(null);
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");

  // Fetch academic years and set default
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await fetch("/api/academicYears");
        if (!response.ok) {
          throw new Error("Failed to fetch academic years");
        }
        const data = await response.json();
        setAcademicYears(data);
        
        // Find and set the current academic year as default
        const currentYear = data.find((year: AcademicYear) => year.isCurrentYear);
        if (currentYear) {
          setSelectedAcademicYear(currentYear.id.toString());
        } else if (data.length > 0) {
          // Fallback to the first year if no current year is set
          setSelectedAcademicYear(data[0].id.toString());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchAcademicYears();
  }, []);

  // Fetch distribution data only when academic year is selected
  useEffect(() => {
    const fetchDistribution = async () => {
      if (!selectedAcademicYear) return;

      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/students/student-distribution?academicYearId=${selectedAcademicYear}`);
        if (!response.ok) {
          throw new Error("Failed to fetch distribution data");
        }
        const data = await response.json();
        setDistribution(data);
        console.log("Distribution data:", data.transport);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setDistribution(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, [selectedAcademicYear]);

  const handleAcademicYearChange = (value: string) => {
    setSelectedAcademicYear(value);
    setDistribution(null); // Clear previous distribution data
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <h1 className="text-2xl font-bold text-gray-700">
              Student Distribution
            </h1>
            <BusFront className="w-6 h-6 mt-1 text-red-700" />
          </div>
          <Select
            value={selectedAcademicYear}
            onValueChange={handleAcademicYearChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={year.id.toString()}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-gray-900 flex justify-start text-base mt-2">
          {!selectedAcademicYear 
            ? "Please select an academic year to view distribution" 
            : "Click on the cards to view detailed information"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading distribution data...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : !selectedAcademicYear ? (
        <div className="text-center py-8 text-gray-500">
          Select an academic year to view student distribution
        </div>
      ) : distribution ? (
        <>
          <div className="space-y-4">
            <DistributionCard
              title="Hostel Students"
              icon={Home}
              total={distribution.hostel.total}
              boys={distribution.hostel.boys}
              girls={distribution.hostel.girls}
              onClick={() => setSelectedType("hostel")}
              gradient="bg-white"
            />
            <DistributionCard
              title="Transport Students"
              icon={Bus}
              total={distribution.transport.total}
              boys={distribution.transport.boys}
              girls={distribution.transport.girls}
              extraInfo={{
                label: "Active Routes",
                value: distribution.transport.routes,
              }}
              onClick={() => setSelectedType("transport")}
              gradient="bg-white"
            />
            <DistributionCard
              title="Day Scholars"
              icon={GraduationCap}
              total={distribution.dayScholar.total}
              boys={distribution.dayScholar.boys}
              girls={distribution.dayScholar.girls}
              onClick={() => setSelectedType("dayScholar")}
              gradient="bg-white"
            />
          </div>

          {selectedType && (
            <DistributionDetailsDialog
              isOpen={!!selectedType}
              onClose={() => setSelectedType(null)}
              type={selectedType}
              data={distribution[selectedType]}
            />
          )}
        </>
      ) : null}
    </div>
  );
}