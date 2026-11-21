-- CreateTable
CREATE TABLE "branch_class_section" (
    "id" SERIAL NOT NULL,
    "branchId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_class_section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branch_class_section_branchId_classId_sectionId_key" ON "branch_class_section"("branchId", "classId", "sectionId");

-- AddForeignKey
ALTER TABLE "branch_class_section" ADD CONSTRAINT "branch_class_section_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_class_section" ADD CONSTRAINT "branch_class_section_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_class_section" ADD CONSTRAINT "branch_class_section_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
