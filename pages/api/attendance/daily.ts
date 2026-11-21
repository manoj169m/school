import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { Gender, AttendanceStatus } from '@prisma/client';

interface ClassGenderCount {
  boys: number;
  girls: number;
}

type TrendType = 'up' | 'down';

interface AttendanceStat {
  title: string;
  value: number;
  trend: TrendType;
  change: string;
  data: Record<string, ClassGenderCount>;
}

interface ApiResponse {
  stats: AttendanceStat[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date, branchId } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    // Parse date
    const [datePart] = (date as string).split(' ');
    const [day, month, year] = datePart.split('-');
    const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const nextDate = new Date(parsedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Get current academic year
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: { isCurrentYear: true },
      select: { id: true }
    });

    if (!currentAcademicYear) {
      return res.status(404).json({ error: 'No current academic year found' });
    }

    // Base conditions for queries
    const baseConditions = {
      academicYearId: currentAcademicYear.id,
      ...(branchId && branchId !== 'all' ? { branchId: parseInt(branchId as string) } : {})
    };

    // Get all data in parallel
    const [
      enrollmentData,
      attendanceData,
      previousDayAttendance,
      totalEnrollments
    ] = await Promise.all([
      // Get class-wise enrollment data
      prisma.studentEnrollment.findMany({
        where: {
          ...baseConditions,
          status: 'Active'
        },
        include: {
          student: {
            select: {
              gender: true
            }
          },
          class: {
            select: {
              name: true
            }
          },
          section: {
            select: {
              name: true
            }
          }
        }
      }),

      // Get today's attendance data
      prisma.attendanceHeader.findMany({
        where: {
          ...baseConditions,
          date: {
            gte: parsedDate,
            lt: nextDate
          }
        },
        select: {
          classId: true,
          sectionId: true,
          class: { select: { name: true } },
          section: { select: { name: true } },
          details: {
            select: {
              status: true,
              enrollment: {
                select: {
                  student: {
                    select: {
                      gender: true
                    }
                  }
                }
              }
            }
          }
        }
      }),

      // Get previous day's attendance
      prisma.attendanceHeader.groupBy({
        by: ['date'],
        where: {
          ...baseConditions,
          date: {
            gte: new Date(parsedDate.getTime() - 24 * 60 * 60 * 1000),
            lt: parsedDate
          }
        },
        _sum: {
          totalPresent: true,
          totalAbsent: true
        }
      }),

      // Get total enrollments count
      prisma.studentEnrollment.count({
        where: {
          ...baseConditions,
          status: 'Active'
        }
      })
    ]);

    // Process attendance data
    const presentMap = new Map<string, ClassGenderCount>();
    const absentMap = new Map<string, ClassGenderCount>();
    const enrollmentMap = new Map<string, ClassGenderCount>();
    const postedClassMap = new Map<string, ClassGenderCount>();
    const notPostedClassMap = new Map<string, ClassGenderCount>();

    // First, map all enrollments and initialize notPostedClassMap with actual gender counts
    enrollmentData.forEach(enrollment => {
      const className = `${enrollment.class.name}-${enrollment.section.name}`;
      
      // Handle enrollment counting
      const current = enrollmentMap.get(className) || { boys: 0, girls: 0 };
      const notPostedCurrent = notPostedClassMap.get(className) || { boys: 0, girls: 0 };
      
      if (enrollment.student.gender === Gender.MALE) {
        current.boys += 1;
        notPostedCurrent.boys += 1;
      } else if (enrollment.student.gender === Gender.FEMALE) {
        current.girls += 1;
        notPostedCurrent.girls += 1;
      }
      
      enrollmentMap.set(className, current);
      notPostedClassMap.set(className, notPostedCurrent);
    });

    let totalPresent = 0;
    let totalAbsent = 0;

    // Process attendance data and update posted/not posted maps
    attendanceData.forEach(header => {
      const className = `${header.class.name}-${header.section.name}`;
      const presentCount = { boys: 0, girls: 0 };
      const absentCount = { boys: 0, girls: 0 };

      header.details.forEach(detail => {
        const isPresent = detail.status === AttendanceStatus.P;
        const isMale = detail.enrollment.student.gender === Gender.MALE;

        if (isPresent) {
          if (isMale) presentCount.boys++;
          else presentCount.girls++;
        } else {
          if (isMale) absentCount.boys++;
          else absentCount.girls++;
        }
      });

      presentMap.set(className, presentCount);
      absentMap.set(className, absentCount);
      
      // Update posted class map with actual gender counts
      const enrollmentCounts = enrollmentMap.get(className) || { boys: 0, girls: 0 };
      postedClassMap.set(className, {
        boys: enrollmentCounts.boys,
        girls: enrollmentCounts.girls
      });
      
      // Remove from not posted map
      notPostedClassMap.delete(className);

      totalPresent += presentCount.boys + presentCount.girls;
      totalAbsent += absentCount.boys + absentCount.girls;
    });

    // Previous day comparison
    const previousPresent = previousDayAttendance[0]?._sum.totalPresent || 0;

    // Prepare stats array
    const stats: AttendanceStat[] = [
      {
        title: "Total Students",
        value: totalEnrollments,
        trend: "up" as const,
        change: `Total enrolled students`,
        data: Object.fromEntries(enrollmentMap)
      },
      {
        title: "Present Today",
        value: totalPresent,
        trend: (totalPresent > previousPresent ? "up" : "down") as TrendType,
        change: `${((totalPresent / totalEnrollments) * 100).toFixed(1)}% of total`,
        data: Object.fromEntries(presentMap)
      },
      {
        title: "Absent Today",
        value: totalAbsent,
        trend: "down" as const,
        change: `${((totalAbsent / totalEnrollments) * 100).toFixed(1)}% of total`,
        data: Object.fromEntries(absentMap)
      },
      {
        title: "Attendance Posted",
        value: postedClassMap.size,
        trend: "up" as const,
        change: "Classes marked attendance",
        data: Object.fromEntries(postedClassMap)
      },
      {
        title: "Not Posted",
        value: notPostedClassMap.size,
        trend: "down" as const,
        change: `${notPostedClassMap.size} classes pending`,
        data: Object.fromEntries(notPostedClassMap)
      }
    ];

    return res.status(200).json({ stats });

  } catch (error) {
    console.error('Error in attendance API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}