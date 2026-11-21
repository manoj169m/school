/*
  Warnings:

  - You are about to drop the `attendance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_enrollmentId_fkey";

-- DropIndex
DROP INDEX "class_id_name_acronym_idx";

-- DropIndex
DROP INDEX "class_id_name_displayorder_idx";

-- DropIndex
DROP INDEX "section_id_name_acronym_idx";

-- DropIndex
DROP INDEX "section_id_name_displayOrder_idx";

-- DropTable
DROP TABLE "attendance";

-- CreateTable
CREATE TABLE "attendance_headers" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "totalPresent" INTEGER NOT NULL,
    "totalAbsent" INTEGER NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER NOT NULL,

    CONSTRAINT "attendance_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_details" (
    "id" SERIAL NOT NULL,
    "attendanceHeaderId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_archives" (
    "id" SERIAL NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "monthYear" TIMESTAMP(3) NOT NULL,
    "attendanceData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_summaries" (
    "id" SERIAL NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "monthYear" TIMESTAMP(3) NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "presentDays" INTEGER NOT NULL,
    "absentDays" INTEGER NOT NULL,
    "lateDays" INTEGER NOT NULL,
    "holidayDays" INTEGER NOT NULL,
    "odDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attendance_headers_academicYearId_date_idx" ON "attendance_headers"("academicYearId", "date");

-- CreateIndex
CREATE INDEX "attendance_headers_branchId_classId_sectionId_date_idx" ON "attendance_headers"("branchId", "classId", "sectionId", "date");

-- CreateIndex
CREATE INDEX "attendance_headers_date_idx" ON "attendance_headers"("date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_headers_date_branchId_classId_sectionId_key" ON "attendance_headers"("date", "branchId", "classId", "sectionId");

-- CreateIndex
CREATE INDEX "attendance_details_enrollmentId_attendanceHeaderId_idx" ON "attendance_details"("enrollmentId", "attendanceHeaderId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_details_attendanceHeaderId_enrollmentId_key" ON "attendance_details"("attendanceHeaderId", "enrollmentId");

-- CreateIndex
CREATE INDEX "attendance_archives_academicYearId_monthYear_idx" ON "attendance_archives"("academicYearId", "monthYear");

-- CreateIndex
CREATE INDEX "attendance_archives_branchId_classId_sectionId_monthYear_idx" ON "attendance_archives"("branchId", "classId", "sectionId", "monthYear");

-- CreateIndex
CREATE INDEX "attendance_summaries_academicYearId_monthYear_idx" ON "attendance_summaries"("academicYearId", "monthYear");

-- CreateIndex
CREATE INDEX "attendance_summaries_branchId_classId_sectionId_monthYear_idx" ON "attendance_summaries"("branchId", "classId", "sectionId", "monthYear");

-- CreateIndex
CREATE INDEX "attendance_summaries_enrollmentId_idx" ON "attendance_summaries"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_summaries_enrollmentId_monthYear_key" ON "attendance_summaries"("enrollmentId", "monthYear");

-- CreateIndex
CREATE INDEX "classes_displayOrder_idx" ON "classes"("displayOrder");

-- CreateIndex
CREATE INDEX "sections_displayOrder_idx" ON "sections"("displayOrder");

-- AddForeignKey
ALTER TABLE "attendance_headers" ADD CONSTRAINT "attendance_headers_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_headers" ADD CONSTRAINT "attendance_headers_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_headers" ADD CONSTRAINT "attendance_headers_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_headers" ADD CONSTRAINT "attendance_headers_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_details" ADD CONSTRAINT "attendance_details_attendanceHeaderId_fkey" FOREIGN KEY ("attendanceHeaderId") REFERENCES "attendance_headers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_details" ADD CONSTRAINT "attendance_details_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "student_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_archives" ADD CONSTRAINT "attendance_archives_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_archives" ADD CONSTRAINT "attendance_archives_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_archives" ADD CONSTRAINT "attendance_archives_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_archives" ADD CONSTRAINT "attendance_archives_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "student_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "academic_year_id_label_idx" RENAME TO "academic_years_id_label_idx";

-- RenameIndex
ALTER INDEX "id_name_index" RENAME TO "branches_id_name_idx";

-- RenameIndex
ALTER INDEX "class_id_name_idx" RENAME TO "classes_id_name_idx";

-- RenameIndex
ALTER INDEX "section_id_name_idx" RENAME TO "sections_id_name_idx";
