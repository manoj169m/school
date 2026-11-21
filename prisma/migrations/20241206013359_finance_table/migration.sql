-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'INCOME', 'EXPENSE', 'LIABILITY');

-- CreateEnum
CREATE TYPE "FeeGenderType" AS ENUM ('MALE', 'FEMALE', 'BOTH');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "description" TEXT,
    "openingBalance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees_by_class" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "term" INTEGER NOT NULL,
    "incomeType" TEXT NOT NULL,
    "gender" "FeeGenderType" NOT NULL,
    "admissionOnly" BOOLEAN NOT NULL DEFAULT false,
    "daysScholarOnly" BOOLEAN NOT NULL DEFAULT false,
    "classId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "feeCategoryId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fees_by_class_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_account_id" ON "fees_by_class"("accountId");

-- CreateIndex
CREATE INDEX "idx_class_id" ON "fees_by_class"("classId");

-- CreateIndex
CREATE INDEX "idx_section_id" ON "fees_by_class"("sectionId");

-- CreateIndex
CREATE INDEX "idx_branch_id" ON "fees_by_class"("branchId");

-- CreateIndex
CREATE INDEX "idx_academic_year_id" ON "fees_by_class"("academicYearId");

-- CreateIndex
CREATE INDEX "idx_fee_category_id" ON "fees_by_class"("feeCategoryId");

-- CreateIndex
CREATE INDEX "idx_class_section_branch_year" ON "fees_by_class"("classId", "sectionId", "branchId", "academicYearId");

-- CreateIndex
CREATE INDEX "idx_term_gender" ON "fees_by_class"("term", "gender");

-- AddForeignKey
ALTER TABLE "fees_by_class" ADD CONSTRAINT "fees_by_class_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_by_class" ADD CONSTRAINT "fees_by_class_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_by_class" ADD CONSTRAINT "fees_by_class_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_by_class" ADD CONSTRAINT "fees_by_class_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_by_class" ADD CONSTRAINT "fees_by_class_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees_by_class" ADD CONSTRAINT "fees_by_class_feeCategoryId_fkey" FOREIGN KEY ("feeCategoryId") REFERENCES "fee_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
