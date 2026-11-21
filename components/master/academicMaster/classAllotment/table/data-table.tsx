'use client';

import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import Loading from '@/app/loading';
import { toast } from '@/hooks/use-toast';

interface CombinedData {
  classes: { id: number; name: string }[];
  sections: { id: number; name: string }[];
  academicYears: { id: number; label: string }[];
  branches: { id: number; name: string }[];
}

interface SectionAllocation {
  classId: number;
  className: string;
  selectedSections: number[];
  existingSections: number[];
}

interface SectionAllocationManagerProps {
  onClose?: () => void;
}

export default function SectionAllocationManager({ onClose }: SectionAllocationManagerProps) {
  const [combinedData, setCombinedData] = useState<CombinedData | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [sectionAllocations, setSectionAllocations] = useState<SectionAllocation[]>([]);

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        const response = await fetch('/api/models/combined');
        const data = await response.json();
        setCombinedData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch combined data",
          variant: "destructive"
        });
        console.log(error);
        
      }
    };

    fetchCombinedData();
  }, []);

  useEffect(() => {
    const fetchExistingAllocations = async () => {
      if (!selectedAcademicYear || !selectedBranch) return;
  
      try {
        const response = await fetch(
          `/api/models/branch-class-section?academicYearId=${selectedAcademicYear}&branchId=${selectedBranch}`
        );
        const result = await response.json();
  
        if (result.data) {
          const initialAllocations = combinedData?.classes.map(cls => {
            const existingAllocation = result.data.find(
              (alloc: { classId: number; sectionIds: number[] }) => 
                alloc.classId === cls.id
            );
  
            return {
              classId: cls.id,
              className: cls.name,
              selectedSections: existingAllocation ? existingAllocation.sectionIds : [],
              existingSections: existingAllocation ? existingAllocation.sectionIds : [], // Include existing sections
            };
          }) || [];
  
          setSectionAllocations(initialAllocations);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch existing allocations",
          variant: "destructive",
        });
        console.log(error);
        
      }
    };
  
    fetchExistingAllocations();
  }, [selectedAcademicYear, selectedBranch, combinedData]);
  

  const handleAcademicYearChange = (value: string) => {
    setSelectedAcademicYear(parseInt(value));
    setSelectedBranch(null);
    setSectionAllocations([]);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(parseInt(value));
  };

  const toggleSectionForClass = (classId: number, sectionId: number) => {
    setSectionAllocations(prev =>
      prev.map(allocation => {
        if (allocation.classId === classId) {
          const isCurrentlySelected = allocation.selectedSections.includes(sectionId);
          return {
            ...allocation,
            selectedSections: isCurrentlySelected
              ? allocation.selectedSections.filter(id => id !== sectionId)
              : [...allocation.selectedSections, sectionId],
          };
        }
        return allocation;
      })
    );
  };
  

  const handleSubmit = async () => {
    if (!selectedAcademicYear || !selectedBranch) {
      toast({
        title: "Validation Error",
        description: "Please select Academic Year and Branch",
        variant: "destructive",
      });
      return;
    }
  
    // Prepare payload excluding existing sections
    const allocationsToSubmit = sectionAllocations
      .map((alloc) => ({
        classId: alloc.classId,
        sectionIds: alloc.selectedSections.filter(
          (id) => !alloc.existingSections.includes(id)
        ),
      }))
      .filter((alloc) => alloc.sectionIds.length > 0); // Only include if there are new sections
  
    if (allocationsToSubmit.length === 0) {
      toast({
        title: "No Changes",
        description: "No new allocations to save.",
      });
      return;
    }
  
    const payload = {
      academicYearId: selectedAcademicYear,
      branchId: selectedBranch,
      allocations: allocationsToSubmit,
    };
  
    try {
      const response = await fetch("/api/models/branch-class-section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast({
          title: "Success",
          description: `New allocations saved successfully! ${result.count} allocations created.`,
        });
  
        if (onClose) onClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save allocations",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving allocations",
        variant: "destructive",
      });
      console.log(error);
      
    }
  };
  
  
  if (!combinedData) return <Loading />;

  return (
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
                <SelectItem key={year.id} value={year.id.toString()}>
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
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedBranch && (
        <>
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
                      {combinedData.sections.map(section => (
                        <div key={section.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`class-${allocation.classId}-section-${section.id}`}
                            checked={allocation.selectedSections.includes(section.id)}
                            onCheckedChange={() => toggleSectionForClass(allocation.classId, section.id)}
                          />
                          <label 
                            htmlFor={`class-${allocation.classId}-section-${section.id}`}
                            className="text-sm"
                          >
                            {section.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end space-x-2">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSubmit}>Save Allocations</Button>
          </div>
        </>
      )}
    </>
  );
}
