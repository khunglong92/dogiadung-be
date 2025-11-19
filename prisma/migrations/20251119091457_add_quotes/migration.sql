-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20) NOT NULL,
    "company" VARCHAR(255),
    "address" TEXT,
    "title" VARCHAR(255),
    "project_name" VARCHAR(255) NOT NULL,
    "project_type" VARCHAR(255) NOT NULL,
    "project_description" TEXT NOT NULL,
    "budget" VARCHAR(255),
    "expected_completion" VARCHAR(255),
    "technical_requirements" TEXT,
    "content" TEXT NOT NULL,
    "subject" VARCHAR(255) NOT NULL DEFAULT 'quote',
    "attachment_url" TEXT,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);
