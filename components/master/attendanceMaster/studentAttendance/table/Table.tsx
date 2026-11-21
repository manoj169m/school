'use client'
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CalendarIcon, 
  Search, 
  UserCheck, 
  UserX, 
  Clock, 
  Save,
  Download,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  AttendanceStatus, 
  AttendanceStatusLabels, 
  Student,
  FormValues
} from '@/types/attendance';

// Extended FormData interface with type guard
interface FormData {
  values: FormValues | null;
  date: Date | null;
}

interface FormDataWithDate extends FormData {
  date: Date;
}

interface AttendanceTableProps {
  students: Student[];
  onSubmit: (data: Student[]) => void;
  formData: FormData;
  isUpdateMode: boolean;
}

// Type guard for FormData with date
const hasValidDate = (formData: FormData): formData is FormDataWithDate => {
  return formData.date !== null;
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  students: initialStudents, 
  onSubmit,
  formData,
  isUpdateMode 
}) => {
  // State management
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [summaryStats, setSummaryStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0
  });

  // Initialize students and stats
  useEffect(() => {
    if (initialStudents && initialStudents.length > 0) {
      const studentsWithDefaultStatus = initialStudents.map(student => ({
        ...student,
        status: student.status || 'P' as AttendanceStatus
      }));
      setStudents(studentsWithDefaultStatus);
      updateSummaryStats(studentsWithDefaultStatus);
    }
  }, [initialStudents]);

  // Calculate summary statistics
  const updateSummaryStats = (studentList: Student[]) => {
    const stats = studentList.reduce((acc, student) => {
      acc.total++;
      if (student.status === 'P') acc.present++;
      if (student.status === 'A') acc.absent++;
      if (student.status === 'L') acc.late++;
      return acc;
    }, { present: 0, absent: 0, late: 0, total: 0 });
    setSummaryStats(stats);
  };

  // Constants
  const AttendanceStatusList: AttendanceStatus[] = ['P', 'A', 'L', 'FN', 'AN', 'H', 'OD'];

  // Status styling
  const getStatusStyle = (status: AttendanceStatus): string => {
    const styles: Record<AttendanceStatus, string> = {
      'P': 'bg-green-100 text-green-800 border-green-200',
      'A': 'bg-red-100 text-red-800 border-red-200',
      'L': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'FN': 'bg-blue-100 text-blue-800 border-blue-200',
      'AN': 'bg-purple-100 text-purple-800 border-purple-200',
      'H': 'bg-gray-100 text-gray-800 border-gray-200',
      'OD': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return styles[status] || '';
  };

  // Filter students based on search
  const filteredStudents = students.filter((student) =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.lastName && student.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle global status change
  const handleGlobalStatusChange = (newStatus: AttendanceStatus) => {
    const updatedStudents = students.map(student => ({
      ...student,
      status: newStatus,
    }));
    setStudents(updatedStudents);
    updateSummaryStats(updatedStudents);
    
    toast({
      title: 'Status Updated',
      description: `All students marked as ${AttendanceStatusLabels[newStatus]}`,
    });
  };

  // Handle individual status change
  const handleIndividualStatusChange = (studentId: number, newStatus: AttendanceStatus) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, status: newStatus } : student
    );
    setStudents(updatedStudents);
    updateSummaryStats(updatedStudents);
  };

  // Handle submit
  const handleSubmit = () => {
    if (students.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No students to submit attendance for',
      });
      return;
    }
    onSubmit(students);
  };

  // Handle export
  const handleExport = () => {
    if (!hasValidDate(formData)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Date is required for export',
      });
      return;
    }

    const csv = [
      ['Name', 'Branch', 'Class', 'Section', 'Status', 'Date'].join(','),
      ...students.map(student => 
        [
          `${student.firstName} ${student.lastName || ''}`,
          student.branchId,
          student.classId,
          student.sectionId,
          AttendanceStatusLabels[student.status],
          formData.date.toLocaleDateString()
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${formData.date.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Export Successful',
      description: 'Attendance data has been exported to CSV',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              Attendance Record
              {isUpdateMode && (
                <Badge variant="secondary" className="ml-2">
                  Update Mode
                </Badge>
              )}
            </CardTitle>
            {hasValidDate(formData) && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{formData.date.toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search students..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={(value) => handleGlobalStatusChange(value as AttendanceStatus)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Set all status" />
              </SelectTrigger>
              <SelectContent>
                {AttendanceStatusList.map((status) => (
                  <SelectItem key={status} value={status}>
                    {AttendanceStatusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Present</p>
                  <p className="text-2xl font-bold text-green-900">{summaryStats.present}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Absent</p>
                  <p className="text-2xl font-bold text-red-900">{summaryStats.absent}</p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Leave</p>
                  <p className="text-2xl font-bold text-yellow-900">{summaryStats.late}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{summaryStats.total}</p>
                </div>
                <SlidersHorizontal className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="rounded-md border h-[calc(100vh-24rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!students || filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Filter className="h-8 w-8" />
                      <p>{searchTerm ? 'No students found matching search criteria' : 'No students available'}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student, index) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.branchName}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.sectionName}</TableCell>
                    <TableCell>
                      <Select
                        value={student.status}
                        onValueChange={(value) =>
                          handleIndividualStatusChange(student.id, value as AttendanceStatus)
                        }
                      >
                        <SelectTrigger className={`w-40 ${getStatusStyle(student.status)}`}>
                          <SelectValue>
                            {AttendanceStatusLabels[student.status]}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {AttendanceStatusList.map((status) => (
                            <SelectItem 
                              key={status} 
                              value={status}
                              className={getStatusStyle(status)}
                            >
                              {AttendanceStatusLabels[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSubmit}
            className="w-full md:w-auto"
            disabled={students.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            {isUpdateMode ? 'Update Attendance' : 'Submit Attendance'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;