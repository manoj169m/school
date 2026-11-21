'use client';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Student, FormValues } from '@/types/attendance';
import { formatQueryParams, normalizeDate } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import AttendanceForm from '../studentAttendance';
import AttendanceTable from './Table';

const AttendanceTracker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const optimizedHandlerRef = useRef<{
    handleSubmit: (students: Student[], formValues: FormValues, isUpdateMode: boolean) => Promise<void>;
  }>();
  const [formData, setFormData] = useState<{
    values: FormValues | null;
    date: Date | null;
  }>({
    values: null,
    date: null,
  });

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const simulateProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
    return () => clearInterval(interval);
  };

  const handleFormSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const cleanup = simulateProgress();
    
    try {
      const normalizedDate = normalizeDate(data.date);
      const queryParams = formatQueryParams({
        academicYearId: data.academicYearId,
        branchIds: data.branchIds,
        classIds: data.classIds,
        sectionIds: data.sectionIds,
        date: normalizedDate.toISOString(),
      });

      const existingResponse = await fetch(`/api/attendance/fetch?${queryParams}`);
      
      if (!existingResponse.ok) {
        const errorText = await existingResponse.text();
        throw new Error(`Failed to check existing attendance: ${errorText}`);
      }

      const existingAttendance = await existingResponse.json();

      if (existingAttendance.length > 0) {
        const shouldUpdate = window.confirm(
          'Attendance records already exist for this date. Would you like to view and update them?'
        );

        if (shouldUpdate) {
          setStudents(existingAttendance);
          setIsUpdateMode(true);
        } else {
          toast({
            title: 'Information',
            description: 'Please select a different date.',
          });
          setIsLoading(false);
          return;
        }
      } else {
        const response = await fetch(`/api/models/studentList?${queryParams}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch students: ${errorText}`);
        }

        const fetchedStudents: Student[] = await response.json();
        
        setStudents(fetchedStudents.map(student => ({
          ...student,
          status: 'P'
        })));
      }

      setFormData({
        values: data,
        date: normalizedDate,
      });
      setShowTable(true);

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch data.',
      });
    } finally {
      cleanup();
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  const handleAttendanceSubmit = async (attendanceData: Student[]) => {
    if (!formData.values || !formData.date) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing form data or date.',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the optimized handler for submission
      await optimizedHandlerRef.current?.handleSubmit(
        attendanceData,
        formData.values,
        isUpdateMode
      );

      // Reset states after successful submission
      setShowTable(false);
      setStudents([]);
      setFormData({ values: null, date: null });
      setIsUpdateMode(false);

    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit attendance.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize the optimized handler
  // Modified optimized handler with proper student mapping
useEffect(() => {
  const handler = {
    handleSubmit: async (
      students: Student[],
      formValues: FormValues,
      isUpdateMode: boolean
    ) => {
      // Group students by their branch-class-section combination
      const groupedStudents = students.reduce((groups, student) => {
        // Only group students if they have valid branch, class, and section IDs
        if (student.branchId && student.classId && student.sectionId) {
          const key = `${student.branchId}-${student.classId}-${student.sectionId}`;
          if (!groups[key]) {
            groups[key] = {
              branchId: student.branchId,
              classId: student.classId,
              sectionId: student.sectionId,
              students: []
            };
          }
          groups[key].students.push(student);
        }
        return groups;
      }, {} as Record<string, {
        branchId: number;
        classId: number;
        sectionId: number;
        students: Student[];
      }>);

      const totalGroups = Object.keys(groupedStudents).length;
      let processedGroups = 0;

      if (totalGroups === 0) {
        throw new Error('No valid student groups found. Please check branch, class, and section assignments.');
      }

      // Process each group separately
      for (const [key, group] of Object.entries(groupedStudents)) {
        const payload = {
          academicYearId: Number(formValues.academicYearId),
          branchIds: [group.branchId],
          classIds: [group.classId],
          sectionIds: [group.sectionId],
          date: formValues.date.toISOString(),
          attendanceRecords: group.students.map(student => ({
            enrollmentId: student.enrollmentId,
            status: student.status,
            branchId: group.branchId,
            classId: group.classId,
            sectionId: group.sectionId,
            remarks: student.remarks
          })),
          forceUpdate: isUpdateMode
        };

        console.log(`Processing group ${key}:`, payload);

        const response = await fetch('/api/attendance/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `Failed to submit attendance for group ${key}`);
        }

        processedGroups++;
        setLoadingProgress((processedGroups / totalGroups) * 100);
      }

      toast({
        title: 'Success',
        description: `Processed ${totalGroups} class sections successfully`
      });
    }
  };

  optimizedHandlerRef.current = handler;
}, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mx-auto px-4 py-8 space-y-6">

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Attendance Form</CardTitle>
          {isUpdateMode && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                You are updating existing attendance records for this date.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <AttendanceForm
            onSubmit={handleFormSubmit} 
            isLoading={isLoading} 
          />
          
          {isLoading && (
            <div className="mt-4 space-y-2">
              <Progress value={loadingProgress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">
                {loadingProgress < 100 ? 'Processing...' : 'Almost done...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showTable && students.length > 0 && (
        <AttendanceTable
          students={students}
          onSubmit={handleAttendanceSubmit}
          formData={formData}
          isUpdateMode={isUpdateMode}
        />
      )}
    </div>
  );
};

export default AttendanceTracker;