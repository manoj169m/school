import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// Define the Grade type with its relationships

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log the request method to debug
  console.log('Request method:', req.method);
  console.log('Request query:', req.query);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { academicYearId, branchIds, classIds } = req.query;

    // Convert string IDs to arrays of numbers
    const branchIdsArray = typeof branchIds === 'string' ? branchIds.split(',').map(Number) : [];
    const classIdsArray = typeof classIds === 'string' ? classIds.split(',').map(Number) : [];
    const academicYearIdNumber = parseInt(academicYearId as string);

    console.log('Parsed IDs:', {
      academicYearId: academicYearIdNumber,
      branchIds: branchIdsArray,
      classIds: classIdsArray
    });

    // Validate IDs exist
    const validBranches = await prisma.branch.findMany({
      where: {
        id: { in: branchIdsArray }
      },
      select: { id: true }
    });

    const validClasses = await prisma.class.findMany({
      where: {
        id: { in: classIdsArray }
      },
      select: { id: true }
    });

    const grades = await prisma.grade.findMany({
      where: {
        academicYearId: academicYearIdNumber,
        branchId: { in: validBranches.map(b => b.id) },
        classId: { in: validClasses.map(c => c.id) }
      },
      select: {
        id: true,
        minMarks: true,
        maxMarks: true,
        grade: true,
        description: true,
        academicYearId: true,
        branchId: true,
        classId: true,
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
    });

    const formattedGrades = grades.map(grade => ({
      id: grade.id,
      minMarks: grade.minMarks,
      maxMarks: grade.maxMarks,
      grade: grade.grade,
      description: grade.description,
      academicYear: {
        name: grade.academicYear.label
      },
      branch: {
        name: grade.branch.name
      },
      class: {
        name: grade.class.name
      }
    }));

    return res.status(200).json(formattedGrades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return res.status(500).json({
      message: 'Error fetching grades',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}