-- AlterTable
ALTER TABLE "users" ADD COLUMN "documents" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
