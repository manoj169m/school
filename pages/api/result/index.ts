  import { NextApiRequest, NextApiResponse } from 'next';
  import prisma from '@/lib/prisma';

  // Base interfaces for entities
  interface BaseEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface SubjectResult extends BaseEntity {
    examResultId?: number;
    examSubjectId: number;
    enrollmentId: number;
    marksObtained: number;
    isPass: boolean;
  }

  interface ExamResult extends BaseEntity {
    examId: number;
    enrollmentId: number;
    totalMarks: number;
    maxTotalMarks: number;
    percentage: number;
    isPass: boolean;
    grade?: string | null;
    rank?: number | null;
    subjectResults: SubjectResult[];
  }

  interface APIResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    details?: string;
  }

  type ExamResultResponse = APIResponse<ExamResult[]>;

  // Type guard function to validate ExamResult
  function isExamResult(obj: any): obj is ExamResult {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.examId === 'number' &&
      typeof obj.enrollmentId === 'number' &&
      typeof obj.totalMarks === 'number' &&
      typeof obj.maxTotalMarks === 'number' &&
      typeof obj.percentage === 'number' &&
      typeof obj.isPass === 'boolean' &&
      Array.isArray(obj.subjectResults) &&
      obj.subjectResults.every((sr: any) => 
        typeof sr === 'object' &&
        sr !== null &&
        typeof sr.examSubjectId === 'number' &&
        typeof sr.enrollmentId === 'number' &&
        typeof sr.marksObtained === 'number' &&
        typeof sr.isPass === 'boolean'
      )
    );
  }

  // Helper function to safely convert processed results back to ExamResult[]
  function convertToExamResults(data: unknown): ExamResult[] {
    if (!Array.isArray(data)) {
      throw new Error('Expected array of exam results');
    }

    return data.map(item => {
      if (!isExamResult(item)) {
        throw new Error('Invalid exam result structure');
      }
      return item;
    });
  }

  // Helper function to safely process BigInt values
  function processBigInt(obj: unknown): unknown {
    if (obj === null || obj === undefined) return obj;
    if (obj instanceof Date) return obj;
    if (typeof obj === 'bigint') return Number(obj);
    
    if (Array.isArray(obj)) {
      return obj.map(item => processBigInt(item));
    }
    
    if (typeof obj === 'object') {
      const processed: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        processed[key] = processBigInt(value);
      }
      return processed;
    }
    
    return obj;
  }

  // Helper function to parse query parameters
  function parseIds(ids: string | string[] | undefined): number[] {
    if (Array.isArray(ids)) {
      return ids.map(id => Number(id));
    }
    return ids ? [Number(ids)] : [];
  }

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ExamResultResponse>
  ) {
    // POST Handler
   if (req.method === 'PUT') {
  try {
    const { results } = req.body as { results: ExamResult[] };
    
    if (!Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body - expected array of results'
      });
    }

    // Process all results in a single transaction
    const savedResults = await prisma.$transaction(async (tx) => {
      const processedResults = [];

      // Validate all results before processing
      for (const result of results) {
        if (!result.examId || !result.enrollmentId || !Array.isArray(result.subjectResults)) {
          throw new Error(`Invalid result data for enrollment ${result.enrollmentId} exam ${result.examId}`);
        }
      }

      // Group results by examId and enrollmentId
      const resultsByExamAndStudent = results.reduce((acc, result) => {
        const key = `${result.examId}-${result.enrollmentId}`;
        if (!acc.has(key)) {
          acc.set(key, result);
        }
        return acc;
      }, new Map<string, ExamResult>());

      // Process each unique exam-student combination
      for (const result of resultsByExamAndStudent.values()) {
        try {
          // Find existing result
          const existingResult = await tx.examResult.findFirst({
            where: {
              examId: Number(result.examId),
              enrollmentId: Number(result.enrollmentId)
            },
            include: {
              subjectResults: true
            }
          });

          if (!existingResult) {
            throw new Error(`No existing result found for enrollment ${result.enrollmentId} exam ${result.examId}`);
          }

          // Update existing result
          const updatedResult = await tx.examResult.update({
            where: { id: existingResult.id },
            data: {
              totalMarks: Number(result.totalMarks),
              maxTotalMarks: Number(result.maxTotalMarks),
              percentage: Number(result.percentage),
              isPass: Boolean(result.isPass),
              grade: result.grade || null,
              rank: result.rank ? Number(result.rank) : null
            }
          });

          // Delete existing subject results
          await tx.subjectResult.deleteMany({
            where: { examResultId: existingResult.id }
          });

          // Create new subject results
          await Promise.all(
            result.subjectResults.map(async (subject) => {
              return tx.subjectResult.create({
                data: {
                  examResultId: updatedResult.id,
                  examSubjectId: Number(subject.examSubjectId),
                  enrollmentId: Number(result.enrollmentId),
                  marksObtained: Number(subject.marksObtained),
                  isPass: Boolean(subject.isPass)
                }
              });
            })
          );

          const completeResult = await tx.examResult.findUnique({
            where: { id: updatedResult.id },
            include: {
              subjectResults: {
                include: {
                  examSubject: {
                    include: {
                      subject: true
                    }
                  }
                }
              },
              exam: {
                include: {
                  subjects: true
                }
              },
              studentEnrollment: {
                include: {
                  student: true,
                  class: true,
                  section: true
                }
              }
            }
          });

          if (completeResult) {
            processedResults.push(completeResult);
          }

        } catch (error) {
          console.error('Error processing result:', error);
          throw new Error(`Failed to process result for enrollment ${result.enrollmentId} exam ${result.examId}: ${error}`);
        }
      }

      return processedResults;
    }, {
      maxWait: 15000,
      timeout: 60000
    });

    const processedData = processBigInt(savedResults);
    const examResults = convertToExamResults(processedData);

    return res.json({
      success: true,
      message: `Successfully updated ${examResults.length} exam results`,
      data: examResults
    });

  } catch (error) {
    console.error('Error in transaction:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update results',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

    // GET Handler
    if (req.method === 'GET') {
      try {
        const { 
          academicYearId,
          examIds, 
          branchIds, 
          classIds, 
          sectionIds 
        } = req.query;

        if (!academicYearId) {
          return res.status(400).json({
            success: false,
            error: 'Academic year ID is required'
          });
        }

        const examIdArray = parseIds(examIds);
        const branchIdArray = parseIds(branchIds);
        const classIdArray = parseIds(classIds);
        const sectionIdArray = parseIds(sectionIds);

        const results = await prisma.examResult.findMany({
          where: {
            exam: {
              academicYearId: Number(academicYearId),
              ...(examIdArray.length > 0 && { id: { in: examIdArray } }),
              ...(branchIdArray.length > 0 && { branchId: { in: branchIdArray } }),
              ...(classIdArray.length > 0 && { classId: { in: classIdArray } }),
              ...(sectionIdArray.length > 0 && { sectionId: { in: sectionIdArray } })
            }
          },
          include: {
            subjectResults: {
              include: {
                examSubject: {
                  include: {
                    subject: true
                  }
                }
              }
            },
            exam: {
              include: {
                subjects: true
              }
            },
            studentEnrollment: {
              include: {
                student: true,
                class: true,
                section: true
              }
            }
          }
        });

        const processedData = processBigInt(results);
        const examResults = convertToExamResults(processedData);

        return res.json({
          success: true,
          data: examResults
        });

      } catch (error) {
        console.error('Error fetching results:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch results',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Method Not Allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`
    });
  }