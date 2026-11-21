/*
  Warnings:

  - You are about to drop the column `roomId` on the `hostel_fees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hostelId,academicYearId]` on the table `hostel_fees` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "hostel_fees" DROP CONSTRAINT "hostel_fees_roomId_fkey";

-- DropIndex
DROP INDEX "hostel_fees_hostelId_roomId_academicYearId_key";

-- AlterTable
ALTER TABLE "hostel_fees" DROP COLUMN "roomId";

-- CreateIndex
CREATE UNIQUE INDEX "hostel_fees_hostelId_academicYearId_key" ON "hostel_fees"("hostelId", "academicYearId");
