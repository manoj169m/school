/*
  Warnings:

  - You are about to drop the `results` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_examSubjectId_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_studentId_fkey";

-- DropTable
DROP TABLE "results";

-- CreateTable
CREATE TABLE "subject_results" (
    "id" SERIAL NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "examSubjectId" INTEGER NOT NULL,
    "marksObtained" DOUBLE PRECISION NOT NULL,
    "isPass" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "examResultId" INTEGER,

    CONSTRAINT "subject_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_results" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "maxTotalMarks" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "isPass" BOOLEAN NOT NULL,
    "rank" INTEGER,
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subject_result_student_examSubject_index" ON "subject_results"("enrollmentId", "examSubjectId");

-- CreateIndex
CREATE INDEX "exam_result_exam_student_index" ON "exam_results"("examId", "enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_results_examId_enrollmentId_key" ON "exam_results"("examId", "enrollmentId");

-- AddForeignKey
ALTER TABLE "subject_results" ADD CONSTRAINT "subject_results_examSubjectId_fkey" FOREIGN KEY ("examSubjectId") REFERENCES "exam_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_results" ADD CONSTRAINT "subject_results_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "student_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_results" ADD CONSTRAINT "subject_results_examResultId_fkey" FOREIGN KEY ("examResultId") REFERENCES "exam_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "student_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
