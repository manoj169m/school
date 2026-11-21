/*
  Warnings:

  - You are about to drop the column `endPoint` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `startPoint` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `assignedDate` on the `transport_assignments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[routeId,stopId,term,academicYearId]` on the table `transport_fees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicYearId` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfStops` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `stops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `stops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stopNumber` to the `stops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `transport_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `transport_fees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "transport_fees_routeId_stopId_academicYearId_key";

-- AlterTable
ALTER TABLE "routes" DROP COLUMN "endPoint",
DROP COLUMN "startPoint",
ADD COLUMN     "academicYearId" INTEGER NOT NULL,
ADD COLUMN     "numberOfStops" INTEGER NOT NULL,
ADD COLUMN     "vehicleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stops" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stopNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "transport_assignments" DROP COLUMN "assignedDate",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "term" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "transport_fees" ADD COLUMN     "term" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transport_fees_routeId_stopId_term_academicYearId_key" ON "transport_fees"("routeId", "stopId", "term", "academicYearId");

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
