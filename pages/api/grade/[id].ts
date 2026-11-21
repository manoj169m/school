import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const gradeId = parseInt(id as string, 10);

  if (req.method === 'PUT') {
    try {
      const {
        minMarks,
        maxMarks,
        grade,
        description,
        academicYearId,
        branchId,
        classId
      } = req.body;

      if (!minMarks || !maxMarks || !academicYearId || !branchId || !classId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const updatedGrade = await prisma.grade.update({
        where: { id: gradeId },
        data: {
          minMarks: parseFloat(minMarks.toString()),
          maxMarks: parseFloat(maxMarks.toString()),
          grade: grade || null,
          description: description || null,
          academicYearId,
          branchId: branchId[0], // Update first branch ID
          classId: classId[0], // Update first class ID
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
      });

      return res.status(200).json({
        success: true,
        data: updatedGrade
      });
    } catch (error) {
      console.error('Error updating grade:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update grade',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.grade.delete({
        where: { id: gradeId }
      });

      return res.status(200).json({
        success: true,
        message: 'Grade deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting grade:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete grade',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}