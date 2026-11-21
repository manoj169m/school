import { NextApiRequest, NextApiResponse } from 'next';
import  prisma  from '@/lib/prisma';
import { z } from 'zod';

// Input validation schema
const examInputSchema = z.object({
  name: z.string().min(1, "Exam name is required"),
  academicYear: z.string(),
  branches: z.array(z.string()),
  classes: z.array(z.string()),
  sections: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
});

// Extend Serializable to include Prisma's potential outputs
type Serializable =
  | bigint
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: string]: Serializable };

// Helper function to recursively serialize data
const serializeData = (data: unknown): Serializable => {
  if (data === null || data === undefined) return data;
  if (typeof data === 'bigint') return data.toString();
  if (Array.isArray(data)) return data.map(serializeData);
  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, serializeData(value)])
    );
  }
  return data as Serializable;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const validatedData = examInputSchema.parse(req.body);

      const createdExams = await Promise.all(
        validatedData.branches.flatMap(branchId =>
          validatedData.classes.flatMap(classId =>
            validatedData.sections.map(async (sectionId) => {
              return await prisma.exam.create({
                data: {
                  name: validatedData.name,
                  academicYearId: parseInt(validatedData.academicYear),
                  branchId: parseInt(branchId),
                  classId: parseInt(classId),
                  sectionId: parseInt(sectionId),
                  startDate: new Date(validatedData.startDate),
                  endDate: new Date(validatedData.endDate),
                },
              });
            })
          )
        )
      );

      // Serialize the response data
      const serializedExams = serializeData(createdExams);

      return res.status(201).json({
        message: 'Exams created successfully',
        data: serializedExams,
      });
    } catch (error) {
      console.error('Error creating exam:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid input data',
          errors: error.errors,
        });
      }
      return res.status(500).json({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  else if (req.method === 'GET') {
    try {
      const exams = await prisma.exam.findMany({
        include: {
          academicYear: true,
          branch: {
            select: {
              id: true,
              name: true,
              acronym: true,
              label: true,
              inCharge: true,
              contact: true,
              address: true,
              location: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              acronym: true,
              displayOrder: true,
            },
          },
          section: {
            select: {
              id: true,
              name: true,
              acronym: true,
              displayOrder: true,
            },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const serializedExams = serializeData(exams);

      return res.status(200).json({
        message: 'Exams retrieved successfully',
        data: serializedExams,
      });
    } catch (error) {
      console.error('Error fetching exams:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
