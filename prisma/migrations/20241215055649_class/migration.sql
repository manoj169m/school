/*
  Warnings:

  - You are about to drop the column `status` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `stops` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `stops` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[branchId,sectionId,academicYearId]` on the table `branch_class_section` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `distance` to the `stops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landMark` to the `stops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `transport_fees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "branch_class_section_branchId_classId_sectionId_academicYea_key";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "stops" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "distance" TEXT NOT NULL,
ADD COLUMN     "landMark" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transport_fees" ADD COLUMN     "accountId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "branch_class_section_branchId_sectionId_academicYearId_key" ON "branch_class_section"("branchId", "sectionId", "academicYearId");

-- AddForeignKey
ALTER TABLE "transport_fees" ADD CONSTRAINT "transport_fees_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
