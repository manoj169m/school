/*
  Warnings:

  - A unique constraint covering the columns `[branchId,classId,sectionId,academicYearId]` on the table `branch_class_section` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "branch_class_section_branchId_classId_sectionId_key";

-- CreateIndex
CREATE UNIQUE INDEX "branch_class_section_branchId_classId_sectionId_academicYea_key" ON "branch_class_section"("branchId", "classId", "sectionId", "academicYearId");
