/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentId,date]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attendance_enrollmentId_date_key" ON "attendance"("enrollmentId", "date");
