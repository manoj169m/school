-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_branchId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "branchId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "academic_years" ADD COLUMN     "isCurrentYear" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
