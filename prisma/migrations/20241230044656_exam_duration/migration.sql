/*
  Warnings:

  - Added the required column `duration` to the `exam_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exam_subjects" ADD COLUMN     "duration" INTEGER NOT NULL;
