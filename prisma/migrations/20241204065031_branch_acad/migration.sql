/*
  Warnings:

  - Added the required column `academicYearId` to the `branch_class_section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "branch_class_section" ADD COLUMN     "academicYearId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "branch_class_section" ADD CONSTRAINT "branch_class_section_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
