import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy, TrendingDown, Users, Percent, GraduationCap, BookOpen, Award } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from '@/hooks/use-toast';
import _ from "lodash";

interface Student {
  id: number;
  enrollmentId: number;
  firstName: string;
  lastName: string;
  rollNo: string;
  admissionNo: string;
  branchId: number;
  branchName: string;
  classId: number;
  className: string;
  sectionId: number;
  sectionName: string;
  status: string;
  remarks: string;
}

interface ExamSubject {
  id: number;
  subjectId: number;
  maxMarks: number;
  minMarks: number;
  name: string;
  subject: {
    id: number;
  };
}

interface SubjectResult {
  examSubjectId: number;
  marksObtained: number;
  isPass: boolean;
}

interface ExamResult {
  id: number;
  examId: number;
  enrollmentId: number;
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  isPass: boolean;
  grade: string;
  rank: number;
  subjectResults: SubjectResult[];
  exam?: {
    id: number;
    name: string;
    branchId: number;
    classId: number;
    sectionId: number;
  };
}

interface ExamResultsTableProps {
  academicYear: string;
  branches: string[];
  classes: string[];
  sections: string[];
  examId: string;
  matchedExamIds: number[];
}

const ExamResultsTable: React.FC<ExamResultsTableProps> = ({
  academicYear,
  branches,
  classes,
  sections,
  examId,
  matchedExamIds
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [examData, setExamData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const maxTotalMarks = examSubjects.reduce((total, subject) => total + subject.maxMarks, 0);

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!results.length) return null;

    const totalStudents = students.length;
    const passedStudents = results.filter(r => r.isPass).length;
    const failedStudents = results.filter(r => !r.isPass).length;
    const passPercentage = (passedStudents / totalStudents) * 100;

    // Subject-wise toppers
    const subjectToppers = examSubjects.map(subject => {
      const topperResult = results
        .map(result => {
          const subjectResult = result.subjectResults.find(
            sr => sr.examSubjectId === subject.id
          );
          const student = students.find(s => s.enrollmentId === result.enrollmentId);
          return {
            student,
            marks: subjectResult?.marksObtained || 0
          };
        })
        .sort((a, b) => b.marks - a.marks)[0];

      return {
        subject: subject.name,
        student: topperResult.student ? 
          `${topperResult.student.firstName} ${topperResult.student.lastName}` : '',
        marks: topperResult.marks,
        maxMarks: subject.maxMarks
      };
    });

    // Grade-wise distribution
    const gradeDistribution = _.groupBy(results, 'grade');
    const gradeStats = Object.entries(gradeDistribution).map(([grade, gradeResults]) => ({
      grade: grade || '-',
      count: gradeResults.length,
      percentage: ((gradeResults.length / totalStudents) * 100).toFixed(1)
    }));

    // Marks ranges distribution
    const marksRanges = [
      { range: '91-100', count: 0 },
      { range: '81-90', count: 0 },
      { range: '71-80', count: 0 },
      { range: '61-70', count: 0 },
      { range: '51-60', count: 0 },
      { range: '41-50', count: 0 },
      { range: '33-40', count: 0 },
      { range: '< 33', count: 0 }
    ];

    results.forEach(result => {
      const percentage = result.percentage;
      if (percentage >= 91) marksRanges[0].count++;
      else if (percentage >= 81) marksRanges[1].count++;
      else if (percentage >= 71) marksRanges[2].count++;
      else if (percentage >= 61) marksRanges[3].count++;
      else if (percentage >= 51) marksRanges[4].count++;
      else if (percentage >= 41) marksRanges[5].count++;
      else if (percentage >= 33) marksRanges[6].count++;
      else marksRanges[7].count++;
    });

    return {
      totalStudents,
      passedStudents,
      failedStudents,
      passPercentage: passPercentage.toFixed(1),
      subjectToppers,
      gradeStats,
      marksRanges
    };
  }, [results, students, examSubjects]);

  const getSubjectScore = useCallback((enrollmentId: number, examId: number, subjectId: number) => {
    const result = results.find(r => r.enrollmentId === enrollmentId && r.examId === examId);
    if (!result) return null;

    const subjectResult = result.subjectResults.find(sr => sr.examSubjectId === subjectId);
    return subjectResult ? { marks: subjectResult.marksObtained, isPass: subjectResult.isPass } : null;
  }, [results]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('academicYearId', academicYear);
        branches.forEach(branch => queryParams.append('branchIds', branch));
        classes.forEach(class_ => queryParams.append('classIds', class_));
        sections.forEach(section => queryParams.append('sectionIds', section));
        matchedExamIds.forEach(id => queryParams.append('examIds', id.toString()));

        const [studentsResponse, examResponse, resultsResponse] = await Promise.all([
          fetch(`/api/models/studentList/?${queryParams}`),
          fetch(`/api/exam/${matchedExamIds}?${queryParams}`),
          fetch(`/api/result?${queryParams}`)
        ]);

        if (!studentsResponse.ok || !examResponse.ok || !resultsResponse.ok) {
          throw new Error('Failed to fetch required data');
        }

        const [studentsData, examData, resultsData] = await Promise.all([
          studentsResponse.json(),
          examResponse.json(),
          resultsResponse.json()
        ]);

          const typedStudentsData = studentsData as Student[];
             const uniqueStudents = _.uniqBy(typedStudentsData, 'id');
             setStudents(uniqueStudents);
        
        setExamData(examData);
        
        if (examData.length > 0 && examData[0].subjects) {
          setExamSubjects(examData[0].subjects);
        }

        setResults(resultsData.data || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (academicYear && branches.length > 0 && classes.length > 0 && sections.length > 0) {
      fetchData();
    }
  }, [academicYear, branches, classes, sections, matchedExamIds]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-custom-pink-300" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (

    <div className="space-y-6">
    {analytics && (
      <>
        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-custom-pink-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalStudents}</div>
              <p className="text-xs text-gray-500">
                Pass: {analytics.passedStudents} | Fail: {analytics.failedStudents}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Percentage</CardTitle>
              <Percent className="h-4 w-4 text-custom-pink-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.passPercentage}%</div>
              <p className="text-xs text-gray-500">Overall pass rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grade Distribution</CardTitle>
              <GraduationCap className="h-4 w-4 text-custom-pink-300" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.gradeStats.slice(0, 2).map(grade => (
                  <div key={grade.grade} className="flex justify-between">
                    <span className="text-sm">Grade {grade.grade}</span>
                    <span className="text-sm font-medium">{grade.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marks Distribution</CardTitle>
              <BookOpen className="h-4 w-4 text-custom-pink-300" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.marksRanges.slice(0, 2).map(range => (
                  <div key={range.range} className="flex justify-between">
                    <span className="text-sm">{range.range}%</span>
                    <span className="text-sm font-medium">{range.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Toppers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Subject Toppers</CardTitle>
            <Award className="h-4 w-4 text-custom-pink-300" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.subjectToppers.map(topper => (
                <div key={topper.subject} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm">{topper.subject}</h4>
                  <p className="text-lg font-bold mt-1">{topper.student}</p>
                  <p className="text-sm text-gray-600">
                    {topper.marks}/{topper.maxMarks} ({((topper.marks/topper.maxMarks)*100).toFixed(1)}%)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grade & Marks Distribution Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.gradeStats.map(grade => (
                  <div key={grade.grade} className="flex items-center justify-between">
                    <span className="text-sm font-medium">Grade {grade.grade}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm">{grade.count} students</span>
                      <span className="text-sm text-gray-500">({grade.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marks Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.marksRanges.map(range => (
                  <div key={range.range} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{range.range}%</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm">{range.count} students</span>
                      <span className="text-sm text-gray-500">
                        ({((range.count/analytics.totalStudents)*100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )}
            <Card  className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
    
        <CardContent className="p-6">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-custom-pink-300">
                <TableRow>
                  <TableHead className="text-white">S.No</TableHead>
                  <TableHead className="text-white">Student Name</TableHead>
                  <TableHead className="text-white">Class</TableHead>
                  <TableHead className="text-white">Section</TableHead>
                  {examSubjects.map(subject => (
                    <TableHead key={subject.id} className="text-white">
                      {subject.name}
                      <div className="text-xs">
                        Max: {subject.maxMarks} | Pass: {subject.minMarks}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-white">Total & Percentage</TableHead>
                  <TableHead className="text-white">Grade</TableHead>
                  <TableHead className="text-white">Rank</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => {
                  const result = results.find(r => r.enrollmentId === student.enrollmentId);
                  
                  return (
                    <TableRow 
                      key={student.id} 
                      className={`hover:bg-gray-50 ${
                        result?.rank === 1 ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {`${student.firstName} ${student.lastName}`.trim()}
                        <div className="text-xs text-gray-500">
                          Roll: {student.rollNo} | Adm: {student.admissionNo}
                        </div>
                      </TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{student.sectionName}</TableCell>
                      
                      {examSubjects.map(subject => {
                        const score = getSubjectScore(student.enrollmentId, result?.examId || 0, subject.id);
                        return (
                          <TableCell 
                            key={subject.id}
                            className={`text-center ${
                              score && !score.isPass ? 'text-red-600 font-medium' : ''
                            }`}
                          >
                            {score ? score.marks : '-'}
                          </TableCell>
                        );
                      })}
                      
                      <TableCell className="font-medium">
                        {result ? (
                          <>
                            <div>{result.totalMarks}/{result.maxTotalMarks}</div>
                            <div className="text-sm text-gray-600">
                              {result.percentage.toFixed(2)}%
                            </div>
                          </>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{result?.grade || '-'}</TableCell>
                      <TableCell>
                        <span className={`${
                          result?.rank === 1 ? 'text-yellow-600 font-bold' : ''
                        }`}>
                          {result?.rank || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {result && (
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            result.isPass 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.isPass ? 'Pass' : 'Fail'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        </Card>
     
    </div>
  );
};

export default ExamResultsTable;