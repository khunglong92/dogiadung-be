/*
  Warnings:

  - Added the required column `title` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "contact_info" (
    "id" TEXT NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "working_hours" VARCHAR(255) NOT NULL,
    "google_map_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);
