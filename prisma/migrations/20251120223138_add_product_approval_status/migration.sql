/*
  Warnings:

  - You are about to drop the column `bannedBy` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "public"."ProductApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "public"."products" 
ADD COLUMN IF NOT EXISTS "approvalStatus" "public"."ProductApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT,
ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT;

-- AlterTable
ALTER TABLE "public"."users" 
DROP COLUMN IF EXISTS "bannedBy",
ADD COLUMN IF NOT EXISTS "banExpiresAt" TIMESTAMP(3);
