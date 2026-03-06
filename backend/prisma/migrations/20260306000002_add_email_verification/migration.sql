-- AlterTable
ALTER TABLE "users" ADD COLUMN "emailVerifie" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "tokenVerification" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_tokenVerification_key" ON "users"("tokenVerification");
