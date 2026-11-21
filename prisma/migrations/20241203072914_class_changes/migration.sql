/*
  Warnings:

  - The `previousClass` column on the `classes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "previousClass",
ADD COLUMN     "previousClass" INTEGER;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_previousClass_fkey" FOREIGN KEY ("previousClass") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
