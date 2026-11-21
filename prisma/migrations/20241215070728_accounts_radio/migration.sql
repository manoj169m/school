-- CreateEnum
CREATE TYPE "ApplicableCategory" AS ENUM ('TRANSPORT', 'HOSTEL', 'NONE');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "applicableFor" "ApplicableCategory"[];
