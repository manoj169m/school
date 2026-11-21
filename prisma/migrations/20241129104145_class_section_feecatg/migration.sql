-- CreateTable
CREATE TABLE "Classes" (
    "class_id" SERIAL NOT NULL,
    "class_name" TEXT NOT NULL,
    "class_acron" TEXT,
    "pervClass" TEXT,
    "class_do" TEXT,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "Sections" (
    "section_id" SERIAL NOT NULL,
    "section_name" TEXT NOT NULL,
    "sec_do" TEXT,
    "sec_acron" TEXT,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "FeeCategory" (
    "feeCatg_id" SERIAL NOT NULL,
    "catg" TEXT NOT NULL,
    "desc" TEXT,

    CONSTRAINT "FeeCategory_pkey" PRIMARY KEY ("feeCatg_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeeCategory_catg_key" ON "FeeCategory"("catg");
