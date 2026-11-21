/*
  Warnings:

  - You are about to drop the column `description` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `previousClass` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `sections` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_previousClass_fkey";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "description",
DROP COLUMN "previousClass",
ADD COLUMN     "displayOrder" INTEGER;

-- AlterTable
ALTER TABLE "sections" DROP COLUMN "description",
ADD COLUMN     "displayOrder" INTEGER;
