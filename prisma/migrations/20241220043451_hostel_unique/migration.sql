/*
  Warnings:

  - A unique constraint covering the columns `[hostelId,academicYearId,term]` on the table `hostel_fees` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "hostel_fees_hostelId_academicYearId_key";

-- CreateIndex
CREATE UNIQUE INDEX "hostel_fees_hostelId_academicYearId_term_key" ON "hostel_fees"("hostelId", "academicYearId", "term");
