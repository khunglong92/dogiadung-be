/*
  Warnings:

  - The `content` column on the `services` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `features` column on the `services` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `technologies` column on the `services` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `benefits` column on the `services` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "services" ADD COLUMN     "cta_target" TEXT,
ADD COLUMN     "image_alts" TEXT[],
DROP COLUMN "content",
ADD COLUMN     "content" TEXT[],
DROP COLUMN "features",
ADD COLUMN     "features" TEXT[],
DROP COLUMN "technologies",
ADD COLUMN     "technologies" TEXT[],
DROP COLUMN "benefits",
ADD COLUMN     "benefits" TEXT[];
