/*
  Warnings:

  - Added the required column `dueDate` to the `fees_by_class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fees_by_class" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;
