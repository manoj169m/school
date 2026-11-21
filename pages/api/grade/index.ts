import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface GradePayload {
  minMarks: number;
  maxMarks: number;
  grade?: string;
  description?: string;
  academicYearId: number;
  branchId: number[];  // Array of branch IDs
  classId: number[];   // Array of class IDs
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      minMarks,
      maxMarks,
      grade,
      description,
      academicYearId,
      branchId,
      classId
    } = req.body as GradePayload;

    // Validate required fields
    if (!minMarks || !maxMarks || !academicYearId || !branchId || !classId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate arrays
    if (!Array.isArray(branchId) || !Array.isArray(classId)) {
      return res.status(400).json({
        success: false,
        message: 'branchId and classId must be arrays'
      });
    }

    // Create grades for each branch and class combination
    const gradesToCreate = [];

    for (const branch of branchId) {
      for (const cls of classId) {
        gradesToCreate.push(
          prisma.grade.create({
            data: {
              minMarks: parseFloat(minMarks.toString()),
              maxMarks: parseFloat(maxMarks.toString()),
              grade: grade || null,
              description: description || null,
              academicYearId,
              branchId: branch,
              classId: cls,
            },
            include: {
              academicYear: {
                select: {
                  label: true
                }
              },
              branch: {
                select: {
                  name: true
                }
              },
              class: {
                select: {
                  name: true
                }
              }
            }
          })
        );
      }
    }

    const result = await Promise.all(gradesToCreate);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error creating grades:', error);
    
    // Handle unique constraint violations or other database errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(400).json({
        success: false,
        message: 'A grade with these criteria already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create grades',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}