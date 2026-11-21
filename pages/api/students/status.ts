// pages/api/students/status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { academicYearId, branchIds, classIds, sectionIds, status } = req.query;

    // Parse array parameters
    const branches = Array.isArray(branchIds) ? branchIds : [branchIds];
    const classes = Array.isArray(classIds) ? classIds : [classIds];
    const sections = Array.isArray(sectionIds) ? sectionIds : [sectionIds];

    const students = await prisma.studentEnrollment.findMany({
      where: {
        academicYearId: Number(academicYearId),
        branchId: { in: branches.map(id => Number(id)) },
        classId: { in: classes.map(id => Number(id)) },
        sectionId: { in: sections.map(id => Number(id)) },
        status: status as string,
      },
      select: {
        id: true,
        status: true,
        enrollmentDate: true,
        hostelStatus: true,
        transportStatus: true,
        branchId: true,
        branch: {
          select: {
            id: true,
            acronym: true,
          }
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
        student: {
          select: {
            id: true,
            admissionNo: true,
            applicationNo: true,
            rollNo: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            placeOfBirth: true,
            country: true,
            state: true,
            cityTownVillage: true,
            address: true,
            communicationNo: true,
            phoneNo: true,
            email: true,
            aadharNo: true,
            emisNo: true,
            community: true,
            caste: true,
            bloodGroup: true,
            motherTongue: true,
            religion: true,
            relationName1: true,
            relationType1: true,
            relationNo1: true,
            relationName2: true,
            relationType2: true,
            relationNo2: true,
            relationName3: true,
            relationType3: true,
            relationNo3: true,
            gender: true,
          }
        }
      }
    });

    const formattedStudents = students.map(enrollment => ({
      enrollmentId: enrollment.id,
      enrollmentDate: enrollment.enrollmentDate,
      hostelStatus: enrollment.hostelStatus,
      transportStatus: enrollment.transportStatus,
      branch: {
        id: enrollment.branch.id,
        name: enrollment.branch.acronym,
      },
      class: {
        id: enrollment.class.id,
        name: enrollment.class.name,
      },
      section: {
        id: enrollment.section.id,
        name: enrollment.section.name,
      },
      student: {
        id: enrollment.student.id,
        admissionNo: enrollment.student.admissionNo,
        applicationNo: enrollment.student.applicationNo,
        rollNo: enrollment.student.rollNo,
        firstName: enrollment.student.firstName,
        lastName: enrollment.student.lastName,
        dateOfBirth: enrollment.student.dateOfBirth,
        placeOfBirth: enrollment.student.placeOfBirth,
        country: enrollment.student.country,
        state: enrollment.student.state,
        cityTownVillage: enrollment.student.cityTownVillage,
        address: enrollment.student.address,
        communicationNo: enrollment.student.communicationNo?.toString(),
        phoneNo: enrollment.student.phoneNo?.toString(),
        email: enrollment.student.email,
        aadharNo: enrollment.student.aadharNo?.toString(),
        emisNo: enrollment.student.emisNo,
        community: enrollment.student.community,
        caste: enrollment.student.caste,
        bloodGroup: enrollment.student.bloodGroup,
        motherTongue: enrollment.student.motherTongue,
        religion: enrollment.student.religion,
        gender: enrollment.student.gender,
        guardians: [
          enrollment.student.relationName1 ? {
            name: enrollment.student.relationName1,
            type: enrollment.student.relationType1,
            contactNo: enrollment.student.relationNo1?.toString(),
          } : null,
          enrollment.student.relationName2 ? {
            name: enrollment.student.relationName2,
            type: enrollment.student.relationType2,
            contactNo: enrollment.student.relationNo2?.toString(),
          } : null,
          enrollment.student.relationName3 ? {
            name: enrollment.student.relationName3,
            type: enrollment.student.relationType3,
            contactNo: enrollment.student.relationNo3?.toString(),
          } : null,
        ].filter(Boolean),
      },
      status: enrollment.status
    }));

    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
}