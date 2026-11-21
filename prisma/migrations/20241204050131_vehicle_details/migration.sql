/*
  Warnings:

  - Added the required column `branchId` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chassisNo` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineNo` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mielage` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modal` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "chassisNo" TEXT NOT NULL,
ADD COLUMN     "engineNo" TEXT NOT NULL,
ADD COLUMN     "mielage" TEXT NOT NULL,
ADD COLUMN     "modal" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
