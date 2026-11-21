import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { academicYearId, branchIds, classIds, sectionIds } = req.query;
    
    // Log incoming query params
    console.log('Query params:', { academicYearId, branchIds, classIds, sectionIds });

    // Verify the IDs exist
    const validBranches = await prisma.branch.findMany({
      where: { id: { in: String(branchIds).split(',').map(Number) } },
      select: { id: true }
    });

    const validClasses = await prisma.class.findMany({
      where: { id: { in: String(classIds).split(',').map(Number) } },
      select: { id: true }
    });

    const validSections = await prisma.section.findMany({
      where: { id: { in: String(sectionIds).split(',').map(Number) } },
      select: { id: true }
    });

    const exams = await prisma.exam.findMany({
      where: {
        academicYearId: parseInt(academicYearId as string),
        branchId: { in: validBranches.map(b => b.id) },
        classId: { in: validClasses.map(c => c.id) },
        sectionId: { in: validSections.map(s => s.id) }
      },
      include: {
        branch: true,
        class: true,
        section: true,
        subjects: {
          include: {
            subject: true
          }
        }
      }
    });

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    const formattedExams = exams.map(exam => ({
      id: exam.id,
      name: exam.name,
      startDate: exam.startDate.toISOString(),
      endDate: exam.endDate.toISOString(),
      branch: {
        id: exam.branchId,
        name: exam.branch.name
      },
      class: {
        id: exam.classId,
        name: exam.class.name
      },
      section: {
        id: exam.sectionId,
        name: exam.section.name
      },
      subjects: exam.subjects.map(subject => ({
        id: subject.subjectId,
        name: subject.subject.name,
        examDate: subject.examDate.toISOString(),
        startTime: formatTime(subject.startTime),
        endTime: formatTime(subject.endTime),
        maxMarks: subject.maxMarks,
        minMarks: subject.minMarks,
        duration: subject.duration
      }))
    }));

    return res.status(200).json(formattedExams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return res.status(500).json({ error: 'Failed to fetch exams' });
  }
}