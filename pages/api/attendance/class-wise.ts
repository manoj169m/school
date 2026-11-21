import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { date, branchId } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Missing date parameter' });
    }

    // Get current academic year
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: {
        isCurrentYear: true
      }
    });

    if (!currentAcademicYear) {
      return res.status(404).json({ message: 'No current academic year found' });
    }

    const queryDate = new Date(date as string);
    const startDate = startOfDay(queryDate);
    const endDate = endOfDay(queryDate);

    // Branch-wise data aggregation (for branchId === 'all')
    if (branchId === 'all') {
      // Get all branches
      const branches = await prisma.branch.findMany({
        orderBy: { name: 'asc' }
      });

      // Get attendance headers grouped by branch
      const attendanceHeaders = await prisma.attendanceHeader.findMany({
        where: {
          academicYearId: currentAcademicYear.id,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          details: true,
          branch: true
        }
      });

      // Get enrollment counts by branch
      const enrollmentCounts = await prisma.studentEnrollment.groupBy({
        by: ['branchId'],
        where: {
          academicYearId: currentAcademicYear.id,
          status: 'Active'
        },
        _count: {
          studentId: true
        }
      });

      const chartData = branches.map(branch => {
        const branchHeaders = attendanceHeaders.filter(ah => ah.branchId === branch.id);
        const enrollmentCount = enrollmentCounts.find(ec => ec.branchId === branch.id);

        // Initialize counters
        let present = 0;
        let absent = 0;
        let morningPresent = 0;
        let afternoonPresent = 0;
        let leave = 0;
        let onDuty = 0;
        let totalClasses = 0;
        let markedClasses = 0;
        let holidayClasses = 0;

        branchHeaders.forEach(header => {
          totalClasses++;
          if (header.isHoliday) {
            holidayClasses++;
          } else {
            markedClasses++;
            header.details.forEach(detail => {
              switch (detail.status) {
                case 'P':
                  present++;
                  break;
                case 'A':
                  absent++;
                  break;
                case 'L':
                  leave++;
                  break;
                case 'FN':
                  morningPresent++;
                  break;
                case 'AN':
                  afternoonPresent++;
                  break;
                case 'OD':
                  onDuty++;
                  break;
              }
            });
          }
        });

        return {
          name: branch.acronym,
          present,
          absent,
          morningPresent,
          afternoonPresent,
          leave,
          onDuty,
          total: enrollmentCount?._count.studentId || 0,
          totalClasses,
          markedClasses,
          holidayClasses,
          attendanceMarked: markedClasses > 0
        };
      });

      return res.status(200).json({
        chartData,
        viewType: 'branch',
        totalBranches: branches.length,
        attendancePosted: chartData.filter(d => d.attendanceMarked).length,
        date: queryDate
      });
    } 
    // Class-wise data aggregation (for specific branch)
    else {
      // Get classes for the specific branch
      const classes = await prisma.class.findMany({
        where: {
          branchClassSection: {
            some: {
              academicYearId: currentAcademicYear.id,
              branchId: parseInt(branchId as string)
            }
          }
        },
        orderBy: {
          displayOrder: 'asc'
        }
      });

      // Get attendance headers for the branch
      const attendanceHeaders = await prisma.attendanceHeader.findMany({
        where: {
          academicYearId: currentAcademicYear.id,
          branchId: parseInt(branchId as string),
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          details: true,
          class: true
        }
      });

      // Get enrollment counts by class for the branch
      const enrollmentCounts = await prisma.studentEnrollment.groupBy({
        by: ['classId'],
        where: {
          academicYearId: currentAcademicYear.id,
          branchId: parseInt(branchId as string),
          status: 'Active'
        },
        _count: {
          studentId: true
        }
      });

      const chartData = classes.map(cls => {
        const classHeaders = attendanceHeaders.filter(ah => ah.classId === cls.id);
        const enrollmentCount = enrollmentCounts.find(ec => ec.classId === cls.id);

        let present = 0;
        let absent = 0;
        let morningPresent = 0;
        let afternoonPresent = 0;
        let leave = 0;
        let onDuty = 0;
        let totalSections = 0;
        let markedSections = 0;
        let holidaySections = 0;

        classHeaders.forEach(header => {
          totalSections++;
          if (header.isHoliday) {
            holidaySections++;
          } else {
            markedSections++;
            header.details.forEach(detail => {
              switch (detail.status) {
                case 'P':
                  present++;
                  break;
                case 'A':
                  absent++;
                  break;
                case 'L':
                  leave++;
                  break;
                case 'FN':
                  morningPresent++;
                  break;
                case 'AN':
                  afternoonPresent++;
                  break;
                case 'OD':
                  onDuty++;
                  break;
              }
            });
          }
        });

        return {
          name: cls.name,
          present,
          absent,
          morningPresent,
          afternoonPresent,
          leave,
          onDuty,
          total: enrollmentCount?._count.studentId || 0,
          totalSections,
          markedSections,
          holidaySections,
          attendanceMarked: markedSections > 0
        };
      });

      return res.status(200).json({
        chartData,
        viewType: 'class',
        totalClasses: classes.length,
        attendancePosted: chartData.filter(d => d.attendanceMarked).length,
        date: queryDate
      });
    }

  } catch (error) {
    console.error('Error in attendance API:', error);
    res.status(500).json({ 
      message: 'Internal server error'
    });
  }
}