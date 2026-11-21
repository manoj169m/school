-- DropForeignKey
ALTER TABLE "hostel_assignments" DROP CONSTRAINT "hostel_assignments_feeId_fkey";

-- DropForeignKey
ALTER TABLE "transport_assignments" DROP CONSTRAINT "transport_assignments_feeId_fkey";

-- AlterTable
ALTER TABLE "hostel_assignments" ALTER COLUMN "feeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transport_assignments" ALTER COLUMN "feeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transport_assignments" ADD CONSTRAINT "transport_assignments_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "transport_fees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_assignments" ADD CONSTRAINT "hostel_assignments_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "hostel_fees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
