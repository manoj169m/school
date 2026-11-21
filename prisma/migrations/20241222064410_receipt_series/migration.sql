/*
  Warnings:

  - A unique constraint covering the columns `[receiptNumber]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enrollmentId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptSeriesId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResetPeriod" AS ENUM ('NEVER', 'YEARLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "enrollmentId" INTEGER NOT NULL,
ADD COLUMN     "receiptNumber" TEXT NOT NULL,
ADD COLUMN     "receiptSeriesId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "receipt_series" (
    "id" SERIAL NOT NULL,
    "configId" INTEGER NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "prefix" TEXT NOT NULL,
    "currentNumber" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_configs" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER,
    "prefixFormat" TEXT NOT NULL,
    "startNumber" INTEGER NOT NULL DEFAULT 1,
    "currentNumber" INTEGER NOT NULL,
    "numberFormat" TEXT NOT NULL DEFAULT '00000',
    "resetPeriod" "ResetPeriod" NOT NULL DEFAULT 'YEARLY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "receipt_series_academicYearId_branchId_idx" ON "receipt_series"("academicYearId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_series_configId_academicYearId_branchId_key" ON "receipt_series"("configId", "academicYearId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_configs_accountId_key" ON "receipt_configs"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_receiptNumber_key" ON "Payment"("receiptNumber");

-- AddForeignKey
ALTER TABLE "receipt_series" ADD CONSTRAINT "receipt_series_configId_fkey" FOREIGN KEY ("configId") REFERENCES "receipt_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_series" ADD CONSTRAINT "receipt_series_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_series" ADD CONSTRAINT "receipt_series_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_configs" ADD CONSTRAINT "receipt_configs_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_receiptSeriesId_fkey" FOREIGN KEY ("receiptSeriesId") REFERENCES "receipt_series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "student_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
