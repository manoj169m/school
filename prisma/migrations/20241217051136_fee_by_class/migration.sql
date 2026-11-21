/*
  Warnings:

  - A unique constraint covering the columns `[accountId,term,classId,sectionId,branchId,academicYearId,feeCategoryId]` on the table `fees_by_class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "fees_by_class_accountId_term_classId_sectionId_branchId_aca_key" ON "fees_by_class"("accountId", "term", "classId", "sectionId", "branchId", "academicYearId", "feeCategoryId");
