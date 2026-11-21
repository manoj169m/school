'use client'

import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import SectionAllocationManager from './data-table'; // Import the manager component
import Loading from '@/app/loading';

interface CombinedData {
  academicYears: { id: number; label: string }[];
  branches: { id: number; name: string }[];
}

interface SectionAllocation {
  classId: number;
  className: string;
  sectionIds: number[];
  sectionNames: string[];
}

export default function SectionAllocationDisplay() {
  const [combinedData, setCombinedData] = useState<CombinedData | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [sectionAllocations, setSectionAllocations] = useState<SectionAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New state for managing the add section mode
  const [isAddSectionMode, setIsAddSectionMode] = useState(false);

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        const response = await fetch('/api/models/combined');
        const data = await response.json();
        setCombinedData(data);
      } catch (error) {
        console.error('Failed to fetch combined data:', error);
        setError('Failed to load initial data');
      }
    };

    fetchCombinedData();
  }, []);

  const handleAcademicYearChange = (value: string) => {
    setSelectedAcademicYear(parseInt(value));
    // Reset other selections
    setSelectedBranch(null);
    setSectionAllocations([]);
  };

  const handleBranchChange = async (value: string) => {
    const branchId = parseInt(value);
    setSelectedBranch(branchId);
    
    if (selectedAcademicYear && branchId) {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/models/branch-class-section?academicYearId=${selectedAcademicYear}&branchId=${branchId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch section allocations');
        }

        const responseData = await response.json();
        setSectionAllocations(responseData.data);
      } catch (error) {
        console.error('Error fetching section allocations:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setSectionAllocations([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleAddSectionMode = () => {
    setIsAddSectionMode(!isAddSectionMode);
  };

  if (!combinedData) return <Loading/>;

  return (
    <Card className="w-full  mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className='text-2xl font-bold text-custom-red-600'>
        
          {isAddSectionMode ? 'Add Section Allocation  ' : 'Section Allocation Display'}

        </CardTitle>
        <Button 
          variant="outline" 
          onClick={toggleAddSectionMode}
          className="h-8 bg-custom-pink-300 text-white hover:bg-custom-red-600 hover:text-white"

        >
          {isAddSectionMode ? 'Back to Allocations' : 'Add Section'}
        </Button>
      </CardHeader>
      <CardContent>
        {/* Conditionally render either the allocation display or the manager */}
        {isAddSectionMode ? (
          <SectionAllocationManager 
            onClose={() => setIsAddSectionMode(false)} 
          />
        ) : (
          <>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block mb-2">Select Academic Year</label>
                <Select onValueChange={handleAcademicYearChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {combinedData.academicYears.map(year => (
                      <SelectItem 
                        key={year.id} 
                        value={year.id.toString()}
                      >
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/2">
                <label className="block mb-2">Select Branch</label>
                <Select 
                  onValueChange={handleBranchChange}
                  disabled={!selectedAcademicYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {combinedData.branches.map(branch => (
                      <SelectItem 
                        key={branch.id} 
                        value={branch.id.toString()}
                      >
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && <div className="text-center">Loading allocations...</div>}
            
            {error && (
              <div className="text-red-500 text-center mb-4">
                {error}
              </div>
            )}

            {!isLoading && selectedBranch && sectionAllocations.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Class</TableHead>
                    <TableHead>Sections</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectionAllocations.map(allocation => (
                    <TableRow key={allocation.classId}>
                      <TableCell>{allocation.className}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {allocation.sectionNames.map(sectionName => (
                            <span 
                              key={sectionName} 
                              className="px-2 py-1 bg-gray-100 rounded text-sm"
                            >
                              {sectionName}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!isLoading && selectedBranch && sectionAllocations.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                No section allocations found for the selected academic year and branch.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}