/*
  Warnings:

  - Added the required column `academicYearId` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `grades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "academicYearId" INTEGER NOT NULL,
ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "classId" INTEGER NOT NULL,
ALTER COLUMN "grade" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
