import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { 
      academicYearId, 
      branchIds, 
      classIds, 
      sectionIds, 
      accountIds, 
      termIds, 
      studentStatus 
    } = req.query;

    // Validate required parameters
    if (!academicYearId || !branchIds || !classIds || !sectionIds || !accountIds || !termIds || !studentStatus) {
      return res.status(400).json({ 
        message: "Missing required parameters",
        required: ["academicYearId", "branchIds", "classIds", "sectionIds", "accountIds", "termIds", "studentStatus"]
      });
    }

    // Validate and convert arrays
    const convertToNumberArray = (param: string | string[]): number[] => {
      const arr = Array.isArray(param) ? param : [param];
      return arr.map(id => {
        const num = Number(id);
        if (isNaN(num)) throw new Error(`Invalid ID format: ${id}`);
        return num;
      });
    };

    const concessions = await prisma.concession.findMany({
      where: {
        academicYearId: Number(academicYearId),
        branchId: { in: convertToNumberArray(branchIds) },
        classId: { in: convertToNumberArray(classIds) },
        sectionId: { in: convertToNumberArray(sectionIds) },
        accountId: { in: convertToNumberArray(accountIds) },
        term: { in: convertToNumberArray(termIds) },
        studentFee: {
          enrollment: {
            status: studentStatus as string,
          },
        },
      },
      select: {
        id: true,
        amount: true,
        description: true,
        term: true,
        concessionCategory: {
          select: {
            name: true,
          },
        },
        studentFee: {
          select: {
            enrollment: {
              select: {
                student: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
                class: {
                  select: {
                    name: true,
                  },
                },
                branch: {
                  select: {
                    name: true,
                  },
                },
                section: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json(concessions);
  } catch (error) {
    console.error("Error fetching concessions:", error);
    return res.status(500).json({ 
      message: "Failed to fetch concessions",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}