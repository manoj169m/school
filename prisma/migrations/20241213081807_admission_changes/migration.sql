/*
  Warnings:

  - You are about to drop the column `academicYearId` on the `StudentFee` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `StudentFee` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `StudentFee` table. All the data in the column will be lost.
  - You are about to drop the column `feeCategoryId` on the `StudentFee` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `StudentFee` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `StudentFee` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `transport_assignments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[enrollmentId]` on the table `StudentFee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,academicYearId]` on the table `student_enrollments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enrollmentId` to the `StudentFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `hostel_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `hostel_fees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorCount` to the `hostels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorNumber` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UsageStatus" AS ENUM ('Using', 'NotUsing', 'Used');

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_branchId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_classId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_feeCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFee" DROP CONSTRAINT "StudentFee_studentId_fkey";

-- DropForeignKey
ALTER TABLE "transport_assignments" DROP CONSTRAINT "transport_assignments_vehicleId_fkey";

-- DropIndex
DROP INDEX "idx_student_academic";

-- AlterTable
ALTER TABLE "StudentFee" DROP COLUMN "academicYearId",
DROP COLUMN "branchId",
DROP COLUMN "classId",
DROP COLUMN "feeCategoryId",
DROP COLUMN "sectionId",
DROP COLUMN "studentId",
ADD COLUMN     "enrollmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "hostel_assignments" ADD COLUMN     "status" "UsageStatus" NOT NULL DEFAULT 'Using',
ADD COLUMN     "term" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "hostel_fees" ADD COLUMN     "term" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "hostels" ADD COLUMN     "floorCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "floorNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "student_enrollments" ADD COLUMN     "hostelStatus" "UsageStatus" NOT NULL DEFAULT 'NotUsing',
ADD COLUMN     "transportStatus" "UsageStatus" NOT NULL DEFAULT 'NotUsing';

-- AlterTable
ALTER TABLE "transport_assignments" DROP COLUMN "vehicleId",
ADD COLUMN     "status" "UsageStatus" NOT NULL DEFAULT 'Using';

-- CreateIndex
CREATE UNIQUE INDEX "StudentFee_enrollmentId_key" ON "StudentFee"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_studentId_academicYearId_key" ON "student_enrollments"("studentId", "academicYearId");

-- AddForeignKey
ALTER TABLE "StudentFee" ADD CONSTRAINT "StudentFee_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "student_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
