/*
  Warnings:

  - You are about to drop the `Classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeeCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Classes";

-- DropTable
DROP TABLE "FeeCategory";

-- DropTable
DROP TABLE "Sections";

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "admissionNo" TEXT,
    "applicationNo" TEXT,
    "rollNo" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "placeOfBirth" TEXT,
    "country" TEXT,
    "state" TEXT,
    "cityTownVillage" TEXT,
    "address" TEXT,
    "communicationNo" BIGINT,
    "phoneNo" BIGINT,
    "email" TEXT,
    "aadharNo" BIGINT,
    "emisNo" TEXT,
    "community" TEXT,
    "caste" TEXT,
    "bloodGroup" TEXT,
    "motherTongue" TEXT,
    "religion" TEXT,
    "relationName1" TEXT,
    "relationType1" TEXT,
    "relationNo1" BIGINT,
    "relationName2" TEXT,
    "relationType2" TEXT,
    "relationNo2" BIGINT,
    "relationName3" TEXT,
    "relationType3" TEXT,
    "relationNo3" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_auths" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_auths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrollments" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "feeCategoryId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT,
    "previousClass" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_categories" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "inCharge" TEXT NOT NULL,
    "contact" BIGINT,
    "address" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_logs" (
    "id" SERIAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "performedBy" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_admissionNo_key" ON "students"("admissionNo");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_aadharNo_key" ON "students"("aadharNo");

-- CreateIndex
CREATE UNIQUE INDEX "students_emisNo_key" ON "students"("emisNo");

-- CreateIndex
CREATE UNIQUE INDEX "student_auths_studentId_key" ON "student_auths"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_auths_username_key" ON "student_auths"("username");

-- CreateIndex
CREATE INDEX "student_academic_index" ON "student_enrollments"("studentId", "academicYearId");

-- CreateIndex
CREATE INDEX "academic_class_section_index" ON "student_enrollments"("academicYearId", "classId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_categories_category_key" ON "fee_categories"("category");

-- AddForeignKey
ALTER TABLE "student_auths" ADD CONSTRAINT "student_auths_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_feeCategoryId_fkey" FOREIGN KEY ("feeCategoryId") REFERENCES "fee_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
