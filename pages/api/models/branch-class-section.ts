import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Handle GET request - Retrieve branch class sections
    case 'GET': {
      const { academicYearId, branchId, page = 1, limit } = req.query;
    
      if (!academicYearId || !branchId) {
        return res.status(400).json({
          error: 'Missing required query parameters',
          required: ['academicYearId', 'branchId'],
        });
      }
    
      try {
        let skip = 0;
        let take: number | undefined = undefined; // Allow unlimited rows if no limit is provided
    
        if (limit && parseInt(limit as string) > 0) {
          skip = (parseInt(page as string) - 1) * parseInt(limit as string);
          take = parseInt(limit as string);
        }
    
        // Fetch data with optional pagination
        const branchClassSections = await prisma.branchClassSection.findMany({
          where: {
            academicYearId: Number(academicYearId),
            branchId: Number(branchId),
          },
          include: {
            class: true,
            section: true,
          },
          orderBy: [
            { classId: 'asc' },
            { sectionId: 'asc' },
          ],
          skip,
          take,
        });
    
        // Group data by class
        const groupedAllocations = branchClassSections.reduce((acc, allocation) => {
          const existingClass = acc.find((item) => item.classId === allocation.classId);
    
          if (existingClass) {
            existingClass.sectionIds.push(allocation.sectionId);
            existingClass.sectionNames.push(allocation.section.name);
          } else {
            acc.push({
              classId: allocation.classId,
              className: allocation.class.name,
              sectionIds: [allocation.sectionId],
              sectionNames: [allocation.section.name],
            });
          }
    
          return acc;
        }, [] as Array<{
          classId: number;
          className: string;
          sectionIds: number[];
          sectionNames: string[];
        }>);
    
        res.status(200).json({
          message: 'Branch class sections retrieved successfully',
          data: groupedAllocations,
        });
      } catch (error) {
        console.error('Error fetching branch class sections:', error);
        res.status(500).json({
          error: 'Failed to fetch branch class sections',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;
    }
    

    // Handle POST request - Save branch class sections
    // Handle POST request - Save branch class sections
case 'POST': {
  const { academicYearId, branchId, allocations } = req.body;

  if (!academicYearId || !branchId || !allocations) {
    return res.status(400).json({ error: 'Missing required fields in the request body' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Fetch existing allocations for the branch and academic year
      const existingAllocations = await tx.branchClassSection.findMany({
        where: {
          academicYearId,
          branchId,
        },
      });

      // Create a Set of existing allocation keys for quick lookup
      const existingAllocationSet = new Set(
        existingAllocations.map(
          (allocation) => `${allocation.classId}-${allocation.sectionId}`
        )
      );

      // Prepare only new allocations for insertion
      const newAllocations = allocations.flatMap(
        (allocation: { classId: number; sectionIds: number[] }) =>
          allocation.sectionIds
            .filter((sectionId) => {
              // Add only if it doesn't already exist
              const key = `${allocation.classId}-${sectionId}`;
              return !existingAllocationSet.has(key);
            })
            .map((sectionId) => ({
              academicYearId,
              branchId,
              classId: allocation.classId,
              sectionId,
            }))
      );

      // Insert new allocations
      if (newAllocations.length > 0) {
        await tx.branchClassSection.createMany({
          data: newAllocations,
        });
      }

      return {
        insertedCount: newAllocations.length,
      };
    });

    res.status(201).json({
      message: 'Section allocations updated successfully',
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error('Error updating section allocations:', error);
    res.status(500).json({
      error: 'Failed to update section allocations',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  break;
}


    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
