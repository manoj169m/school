import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { branchId, date } = req.query;
    const selectedDate = date ? new Date(date as string) : new Date();
    
    // Calculate week start and end dates
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Add console.logs for debugging
    console.log('Week Start:', weekStart);
    console.log('Week End:', weekEnd);

    const studentBirthdays = await getStudentBirthdays(branchId as string, weekStart, weekEnd);
    const employeeBirthdays = await getEmployeeBirthdays(branchId as string, weekStart, weekEnd);
    const workAnniversaries = await getWorkAnniversaries(branchId as string, weekStart, weekEnd);
    
    return res.status(200).json({
      studentBirthdays,
      employeeBirthdays,
      workAnniversaries,
      weekDates: getWeekDates(selectedDate),
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

async function getStudentBirthdays(branchId: string, weekStart: Date, weekEnd: Date) {
  const currentYear = new Date().getFullYear();
  return await prisma.studentEnrollment.findMany({
    where: {
      status: 'Active',
      ...(branchId !== 'all' && { branchId: parseInt(branchId) }),
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          rollNo: true,
        },
      },
      class: {
        select: {
          id: true,
          name: true,
        }
      },
      section: {
        select: {
          id: true,
          name: true,
        }
      },
    },
    orderBy: {
      student: {
        dateOfBirth: 'asc',
      },
    },
  }).then(enrollments => 
    enrollments.filter(enrollment => {
      const birthday = new Date(enrollment.student.dateOfBirth);
      const thisYearBirthday = new Date(currentYear, birthday.getMonth(), birthday.getDate());
      return thisYearBirthday >= weekStart && thisYearBirthday <= weekEnd;
    })
  );
}

async function getEmployeeBirthdays(branchId: string, weekStart: Date, weekEnd: Date) {
  const currentYear = new Date().getFullYear();
  return await prisma.employee.findMany({
    where: {
      ...(branchId !== 'all' && {
        branches: {
          some: {
            branchId: parseInt(branchId),
          },
        },
      }),
      dateOfBirth: {
        not: null,
      },
    },
    include: {
      department: {
        select: {
          id: true,
          name: true,
        }
      },
      designation: {
        select: {
          id: true,
          title: true,
        }
      },
    },
    orderBy: {
      dateOfBirth: 'asc',
    },
  }).then(employees =>
    employees.filter(employee => {
      if (!employee.dateOfBirth) return false;
      const birthday = new Date(employee.dateOfBirth);
      const thisYearBirthday = new Date(currentYear, birthday.getMonth(), birthday.getDate());
      return thisYearBirthday >= weekStart && thisYearBirthday <= weekEnd;
    })
  );
}

async function getWorkAnniversaries(branchId: string, weekStart: Date, weekEnd: Date) {
  const currentYear = new Date().getFullYear();
  return await prisma.employee.findMany({
    where: {
      ...(branchId !== 'all' && {
        branches: {
          some: {
            branchId: parseInt(branchId),
          },
        },
      }),
    },
    include: {
      department: {
        select: {
          id: true,
          name: true,
        }
      },
      designation: {
        select: {
          id: true,
          title: true,
        }
      },
    },
    orderBy: {
      dateOfJoin: 'asc',
    },
  }).then(employees =>
    employees.filter(employee => {
      const joinDate = new Date(employee.dateOfJoin);
      const thisYearAnniversary = new Date(currentYear, joinDate.getMonth(), joinDate.getDate());
      return thisYearAnniversary >= weekStart && thisYearAnniversary <= weekEnd;
    })
  );
}

function getWeekDates(date: Date) {
  const week = [];
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - date.getDay());
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    week.push({
      date: currentDate.toISOString(),
      dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: currentDate.getDate(),
    });
  }
  
  return week;
}