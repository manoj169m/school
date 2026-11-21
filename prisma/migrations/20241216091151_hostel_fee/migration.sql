/*
  Warnings:

  - Added the required column `accountId` to the `hostel_fees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hostel_fees" ADD COLUMN     "accountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "hostel_fees" ADD CONSTRAINT "hostel_fees_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
