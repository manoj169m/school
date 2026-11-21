-- CreateIndex
CREATE INDEX "academic_year_id_label_idx" ON "academic_years"("id", "label");

-- CreateIndex
CREATE INDEX "id_accountName_index" ON "accounts"("id", "accountName");

-- CreateIndex
CREATE INDEX "id_accountName_accountType_index" ON "accounts"("id", "accountName", "accountType");

-- CreateIndex
CREATE INDEX "branch_class_section_idx" ON "branch_class_section"("branchId", "classId", "sectionId", "academicYearId");

-- CreateIndex
CREATE INDEX "id_name_index" ON "branches"("id", "name");

-- CreateIndex
CREATE INDEX "name_acronym_index" ON "branches"("name", "acronym");

-- CreateIndex
CREATE INDEX "name_location_index" ON "branches"("name", "location");

-- CreateIndex
CREATE INDEX "class_id_name_idx" ON "classes"("id", "name");

-- CreateIndex
CREATE INDEX "class_id_name_acronym_idx" ON "classes"("id", "name", "acronym");

-- CreateIndex
CREATE INDEX "class_id_name_displayorder_idx" ON "classes"("id", "name", "displayOrder");

-- CreateIndex
CREATE INDEX "id_category_index" ON "fee_categories"("id", "category");

-- CreateIndex
CREATE INDEX "section_id_name_idx" ON "sections"("id", "name");

-- CreateIndex
CREATE INDEX "section_id_name_acronym_idx" ON "sections"("id", "name", "acronym");

-- CreateIndex
CREATE INDEX "section_id_name_displayOrder_idx" ON "sections"("id", "name", "displayOrder");
