-- AlterTable
ALTER TABLE "contact_info" ADD COLUMN     "about_us" TEXT,
ADD COLUMN     "company_type" VARCHAR(255),
ADD COLUMN     "founding_date" TIMESTAMP(3),
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "projects_completed" INTEGER,
ADD COLUMN     "satisfaction_rate" INTEGER,
ADD COLUMN     "satisfied_clients" INTEGER,
ADD COLUMN     "vision" TEXT,
ADD COLUMN     "years_of_experience" INTEGER;
