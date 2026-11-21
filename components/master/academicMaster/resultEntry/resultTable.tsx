import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import _ from 'lodash';

const StudentResultTable: React.FC<StudentResultTableProps> = ({
  academicYear,
  branches,
  classes,
  sections,
  examId,
  matchedExamIds
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [results, setResults] = useState<ResultState>({});
  const [grades, setGrades] = useState<Grade[]>([]);
  const [existingResults, setExistingResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingGroups, setSavingGroups] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [examData, setExamData] = useState<ExamData[]>([]);

  const maxTotalMarks = examSubjects.reduce((total, subject) => total + subject.maxMarks, 0);

  const getResultKey = useCallback((enrollmentId: number, subjectId: number): string => {
    return `${enrollmentId}-${subjectId}`;
  }, []);

  const getGrade = useCallback((percentage: number): string => {
    if (!grades.length) return '-';
    const grade = grades.find(g => 
      percentage >= g.minMarks && percentage <= g.maxMarks
    );
    return grade?.grade || '-';
  }, [grades]);

  const isSubjectPassing = useCallback((marks: number, subject: ExamSubject): boolean => {
    return marks >= subject.minMarks;
  }, []);
  

  const groupedStudents = React.useMemo(() => {
    const groups: { [key: string]: Student[] } = {};
    
    students.forEach(student => {
      const matchingExams = examData.filter(exam => 
        exam.branch.id === student.branchId &&
        exam.class.id === student.classId &&
        exam.section.id === student.sectionId &&
        matchedExamIds.includes(exam.id)
      );

      matchingExams.forEach(exam => {
        const groupKey = `${student.branchId}-${student.classId}-${student.sectionId}-${exam.id}`;
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        if (!groups[groupKey].find(s => s.id === student.id)) {
          groups[groupKey].push(student);
        }
      });
    });

    return groups;
  }, [students, examData, matchedExamIds]);

  const calculateStudentResults = useCallback((groupStudents: Student[]): Map<number, StudentResult> => {
    const studentResults = groupStudents.map(student => {
      const subjectResults: { [key: string]: { marks: number; isPass: boolean } } = {};
      let totalMarks = 0;
      let allMarksValid = true;
      let hasAnyMarks = false;
      let allSubjectsPassing = true;

      examSubjects.forEach(subject => {
        const resultKey = getResultKey(student.enrollmentId, subject.id);
        const result = results[resultKey];
        if (result && result.isValid) {
          totalMarks += result.marks;
          hasAnyMarks = true;
          const isPass = isSubjectPassing(result.marks, subject);
          if (!isPass) allSubjectsPassing = false;
          subjectResults[subject.id] = {
            marks: result.marks,
            isPass
          };
        } else if (result) {
          allMarksValid = false;
        }
      });

      const percentage = hasAnyMarks ? (totalMarks / maxTotalMarks) * 100 : 0;

      return {
        studentId: student.id,
        enrollmentId: student.enrollmentId,
        totalMarks: hasAnyMarks ? totalMarks : 0,
        maxTotalMarks,
        percentage: hasAnyMarks ? percentage : 0,
        grade: hasAnyMarks ? getGrade(percentage) : '-',
        isValid: allMarksValid,
        hasMarks: hasAnyMarks,
        isPass: hasAnyMarks && allSubjectsPassing,
        subjectResults
      };
    });

    const validResults = studentResults
      .filter(result => result.hasMarks)
      .sort((a, b) => b.totalMarks - a.totalMarks || b.percentage - a.percentage);

    const rankedResults = validResults.map((result, index) => ({
      ...result,
      rank: index + 1
    }));

    return new Map(rankedResults.map(result => [result.enrollmentId, result]));
  }, [examSubjects, results, maxTotalMarks, getGrade, getResultKey, isSubjectPassing]);

  const handleMarkChange = (enrollmentId: number, subjectId: number, value: string, maxMarks: number) => {
    const resultKey = getResultKey(enrollmentId, subjectId);
    
    if (value === '') {
      setResults(prev => {
        const newResults = { ...prev };
        delete newResults[resultKey];
        return newResults;
      });
      return;
    }

    const numValue = Number(value);
    const isValid = !isNaN(numValue) && numValue >= 0 && numValue <= maxMarks;

    setResults(prev => ({
      ...prev,
      [resultKey]: {
        marks: numValue,
        isValid
      }
    }));
  };

  const handleGroupSubmit = async (groupKey: string, groupStudents: Student[]) => {
    setSavingGroups(prev => new Set(prev).add(groupKey));
    setError(null);

    try {
      const studentResults = calculateStudentResults(groupStudents);
      const [branchId, classId, sectionId, currentExamId] = groupKey.split('-').map(Number);

      const groupResults = groupStudents
        .map(student => {
          const result = studentResults.get(student.enrollmentId);
          if (!result?.hasMarks || !result?.isValid) return null;

          return {
            examId: Number(currentExamId),
            enrollmentId: student.enrollmentId,
            classId: student.classId,
            sectionId: student.sectionId,
            totalMarks: result.totalMarks,
            maxTotalMarks: result.maxTotalMarks,
            percentage: result.percentage,
            isPass: result.isPass,
            grade: result.grade || null,
            rank: result.rank || null,
            subjectResults: examSubjects.map(subject => ({
              examSubjectId: subject.id,
              enrollmentId: student.enrollmentId,
              marksObtained: result.subjectResults[subject.id]?.marks || 0,
              isPass: result.subjectResults[subject.id]?.isPass || false
            }))
          };
        })
        .filter((result): result is ExamResultSubmission => result !== null);

      if (groupResults.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Warning',
          description: 'No valid results to save for this group'
        });
        return;
      }

      const existingResultsResponse = await fetch(`/api/result?${new URLSearchParams({
        academicYearId: academicYear,
        examIds: currentExamId.toString(),
        classIds: classId.toString(),
        sectionIds: sectionId.toString(),
        branchIds: branchId.toString()
      })}`);

      const existingData = await existingResultsResponse.json();
      const hasExistingResults = existingData.data && existingData.data.length > 0;

      const response = await fetch('/api/result', {
        method: hasExistingResults ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          results: groupResults,
          examId: currentExamId,
          classId,
          sectionId,
          branchId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${hasExistingResults ? 'update' : 'save'} results for this group`);
      }

      await fetchExamResults();

      toast({
        title: 'Success',
        description: `Successfully ${hasExistingResults ? 'updated' : 'saved'} results for ${groupResults.length} students`
      });

    } catch (error) {
      console.error('Error saving group results:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save group results';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage
      });
    } finally {
      setSavingGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupKey);
        return newSet;
      });
    }
  };

  const fetchExamResults = async () => {
    try {
      const resultsQueryParams = new URLSearchParams();
      resultsQueryParams.append('academicYearId', academicYear);
      matchedExamIds.forEach(id => resultsQueryParams.append('examIds', id.toString()));
      branches.forEach(branch => resultsQueryParams.append('branchIds', branch));
      classes.forEach(classId => resultsQueryParams.append('classIds', classId));
      sections.forEach(sectionId => resultsQueryParams.append('sectionIds', sectionId));

      const response = await fetch(`/api/result?${resultsQueryParams}`);
      if (!response.ok) throw new Error('Failed to fetch results');

      const responseData = await response.json();
      if (!responseData.data) return;

      setExistingResults(responseData.data);

      const formattedResults: ResultState = {};
      responseData.data.forEach((result: ExamResult) => {
        result.subjectResults.forEach(subjectResult => {
          const key = getResultKey(result.enrollmentId, subjectResult.examSubjectId);
          formattedResults[key] = {
            marks: subjectResult.marksObtained,
            isValid: true
          };
        });
      });
      
      setResults(formattedResults);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch exam results'
      });
    }
  };
// ... (previous code remains the same until useEffect)

useEffect(() => {
  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const studentsQueryParams = new URLSearchParams();
      studentsQueryParams.append('academicYearId', academicYear);
      branches.forEach(branch => studentsQueryParams.append('branchIds', branch));
      classes.forEach(class_ => studentsQueryParams.append('classIds', class_));
      sections.forEach(section => studentsQueryParams.append('sectionIds', section));

      const examQueryParams = new URLSearchParams();
      examQueryParams.append('academicYearId', academicYear);
      branches.forEach(branch => examQueryParams.append('branchIds', branch));
      classes.forEach(class_ => examQueryParams.append('classIds', class_));
      sections.forEach(section => examQueryParams.append('sectionIds', section));

      const gradesQueryParams = new URLSearchParams();
      gradesQueryParams.append('academicYearId', academicYear);
      branches.forEach(branch => gradesQueryParams.append('branchIds', branch));
      classes.forEach(class_ => gradesQueryParams.append('classIds', class_));

      const [studentsResponse, examResponse, gradesResponse] = await Promise.all([
        fetch(`/api/models/studentList/?${studentsQueryParams}`),
        fetch(`/api/exam/${matchedExamIds}?${examQueryParams}`),
        fetch(`/api/grade/fetch?${gradesQueryParams}`)
      ]);

      if (!studentsResponse.ok || !examResponse.ok || !gradesResponse.ok) {
        throw new Error('Failed to fetch required data');
      }

      const [studentsData, examResponseData, gradesData] = await Promise.all([
        studentsResponse.json(),
        examResponse.json(),
        gradesResponse.json()
      ]);

      const typedStudentsData = studentsData as Student[];
      const uniqueStudents = _.uniqBy(typedStudentsData, 'id');
      setStudents(uniqueStudents);

      if (Array.isArray(examResponseData)) {
        setExamData(examResponseData);
        
        const firstMatchingExam = examResponseData.find(exam => 
          matchedExamIds.includes(exam.id)
        );
        if (firstMatchingExam?.subjects) {
          setExamSubjects(firstMatchingExam.subjects);
        }
      }

      setGrades(gradesData);

      const resultsQueryParams = new URLSearchParams();
      resultsQueryParams.append('academicYearId', academicYear);
      matchedExamIds.forEach(id => {
        resultsQueryParams.append('examIds', id.toString());
      });
      branches.forEach(branch => resultsQueryParams.append('branchIds', branch));
      classes.forEach(classId => resultsQueryParams.append('classIds', classId));
      sections.forEach(sectionId => resultsQueryParams.append('sectionIds', sectionId));

      const resultsResponse = await fetch(`/api/result?${resultsQueryParams}`);
      if (!resultsResponse.ok) {
        throw new Error('Failed to fetch initial results');
      }

      const resultsData = await resultsResponse.json();
      
      if (resultsData.data) {
        setExistingResults(resultsData.data);

        const formattedResults: ResultState = {};
        resultsData.data.forEach((result: ExamResult) => {
          if (result.subjectResults) {
            result.subjectResults.forEach(subjectResult => {
              const key = getResultKey(result.enrollmentId, subjectResult.examSubjectId);
              formattedResults[key] = {
                marks: subjectResult.marksObtained,
                isValid: true
              };
            });
          }
        });
        setResults(formattedResults);
      }

    } catch (error) {
      console.error('Error fetching initial data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch initial data';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch initial data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (academicYear && sections.length > 0 && examId) {
    fetchInitialData();
  }
}, [academicYear, branches, classes, sections, examId, matchedExamIds, getResultKey]);

if (isLoading) {
  return (
    <div className="flex justify-center items-center h-48">
      <Loader2 className="h-8 w-8 animate-spin text-custom-pink-300" />
    </div>
  );
}

return (
  <>
    {Object.entries(groupedStudents).map(([groupKey, groupStudents]) => {
      const [branchId, classId, sectionId, currentExamId] = groupKey.split('-').map(Number);
      const sampleStudent = groupStudents[0];
      const isSaving = savingGroups.has(groupKey);
      
      const matchingExam = examData.find(exam => 
        exam.id === currentExamId &&
        exam.branch.id === branchId &&
        exam.class.id === classId &&
        exam.section.id === sectionId
      );

      if (!matchingExam) return null;

      const existingResult = existingResults.find(r => 
        r.examId === currentExamId &&
        r.exam?.branchId === branchId &&
        r.exam?.classId === classId &&
        r.exam?.sectionId === sectionId
      );

      return (
        <Card key={groupKey} className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {sampleStudent.branchName} - {sampleStudent.className} - {sampleStudent.sectionName}
              <span className="ml-2 text-sm text-gray-500">
                (Exam ID: {currentExamId})
              </span>
            </CardTitle>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => handleGroupSubmit(groupKey, groupStudents)}
                disabled={isSaving || groupStudents.some(student => 
                  examSubjects.some(subject => {
                    const resultKey = getResultKey(student.enrollmentId, subject.id);
                    return results[resultKey] && !results[resultKey].isValid;
                  })
                )}
                className="bg-custom-pink-300 hover:bg-custom-pink-400"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {existingResult ? (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {existingResult ? 'Update Results' : 'Save Results'}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-custom-pink-300">
                  <TableRow>
                    <TableHead className="text-white">S.No</TableHead>
                    <TableHead className="text-white">Student Name</TableHead>
                    <TableHead className="text-white">Roll No</TableHead>
                    <TableHead className="text-white">Admission No</TableHead>
                    <TableHead className="text-white">Class</TableHead>
                    <TableHead className="text-white">Section</TableHead>
                    {examSubjects.map(subject => (
                      <TableHead key={subject.id} className="text-white">
                        {subject.name}
                        <div className="text-white text-sm">
                          Max: {subject.maxMarks} | Pass: {subject.minMarks}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-white">
                      Total & Percentage
                      <div className="text-white text-sm">
                        Max: {maxTotalMarks}
                      </div>
                    </TableHead>
                    <TableHead className="text-white">Grade</TableHead>
                    <TableHead className="text-white">Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupStudents.map((student, index) => {
                    const studentResult = calculateStudentResults(groupStudents).get(student.enrollmentId);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {`${student.firstName} ${student.lastName}`.trim()}
                        </TableCell>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.admissionNo}</TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>{student.sectionName}</TableCell>
                        {examSubjects.map(subject => {
                          const resultKey = getResultKey(student.enrollmentId, subject.id);
                          const result = results[resultKey];
                          const value = result ? result.marks.toString() : '';
                          const subjectResult = studentResult?.subjectResults[subject.id];
                          const isFailingSubject = subjectResult && !subjectResult.isPass;
                          
                          return (
                            <TableCell key={subject.id}>
                              <Input
                                type="number"
                                min={0}
                                max={subject.maxMarks}
                                value={value}
                                onChange={(e) => handleMarkChange(
                                  student.enrollmentId, 
                                  subject.id, 
                                  e.target.value, 
                                  subject.maxMarks
                                )}
                                className={`w-20 ${
                                  result && !result.isValid 
                                    ? 'border-red-500' 
                                    : isFailingSubject 
                                    ? 'border-yellow-500' 
                                    : ''
                                }`}
                              />
                            </TableCell>
                          );
                        })}
                        <TableCell className={`font-medium ${!studentResult?.isValid ? 'text-gray-400' : ''}`}>
                          <div>Total: {studentResult?.hasMarks ? studentResult.totalMarks : '-'}</div>
                          <div className="text-sm text-gray-600">
                            {studentResult?.hasMarks ? `${studentResult.percentage.toFixed(2)}%` : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {studentResult?.grade || '-'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {studentResult?.rank || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </>
);
};

export default StudentResultTable;