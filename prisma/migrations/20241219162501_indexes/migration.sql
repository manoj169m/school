-- CreateIndex
CREATE INDEX "attendance_branchId_classId_sectionId_idx" ON "attendance"("branchId", "classId", "sectionId");

-- CreateIndex
CREATE INDEX "attendance_date_academicYearId_idx" ON "attendance"("date", "academicYearId");
