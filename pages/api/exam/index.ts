import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface ExamSubject {
  subjectId: string;
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm" 
  duration: number;
  maxMarks: string;
  minMarks: string;
  examDate: string;
}

interface ExamPayload {
  exam: {
    examName: string;
    startDate: string;
    endDate: string;
    branchId: number[];
    classId: number[];
    sectionId: number[];
    academicYearId: number;
    subjects: ExamSubject[];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { exam } = req.body as ExamPayload;

    if (!exam) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body: exam object is required'
      });
    }

    // Improved helper function to preserve local time
    const createDateTime = (dateStr: string, timeStr: string): Date => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date(dateStr);
      
      // Create date in local timezone
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        0,
        0
      );
      
      return localDate;
    };

    const examsToCreate = [];

    for (const branchId of exam.branchId) {
      for (const classId of exam.classId) {
        for (const sectionId of exam.sectionId) {
          examsToCreate.push(
            prisma.exam.create({
              data: {
                name: exam.examName,
                branchId,
                classId,
                sectionId,
                academicYearId: exam.academicYearId,
                startDate: new Date(exam.startDate),
                endDate: new Date(exam.endDate),
                subjects: {
                  create: exam.subjects.map(subject => {
                    const startTime = createDateTime(subject.examDate, subject.startTime);
                    const endTime = createDateTime(subject.examDate, subject.endTime);
                    
                    return {
                      subjectId: parseInt(subject.subjectId),
                      maxMarks: parseFloat(subject.maxMarks),
                      minMarks: parseFloat(subject.minMarks),
                      examDate: new Date(subject.examDate),
                      startTime,
                      endTime,
                      duration: subject.duration
                    };
                  })
                }
              },
              include: {
                subjects: {
                  select: {
                    id: true,
                    examId: true,
                    subjectId: true,
                    maxMarks: true,
                    minMarks: true,
                    examDate: true,
                    startTime: true,
                    endTime: true,
                    duration: true,
                    createdAt: true,
                    updatedAt: true
                  }
                }
              }
            })
          );
        }
      }
    }

    const result = await Promise.all(examsToCreate);

    // Transform timestamps back to expected format in response
    const formattedResult = result.map(exam => ({
      ...exam,
      subjects: exam.subjects.map(subject => ({
        ...subject,
        startTime: subject.startTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        endTime: subject.endTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      }))
    }));

    return res.status(200).json({
      success: true,
      data: formattedResult
    });

  } catch (error) {
    console.error('Error creating exams:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create exams',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}