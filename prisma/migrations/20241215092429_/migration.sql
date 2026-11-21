-- AlterTable
ALTER TABLE "accounts"
ALTER COLUMN "applicableFor" TYPE TEXT[] USING "applicableFor"::TEXT[];

