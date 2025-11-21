-- CreateEnum
CREATE TYPE "public"."FlagType" AS ENUM ('REVIEW', 'PRODUCT', 'VENDOR', 'USER', 'MESSAGE');

-- CreateEnum
CREATE TYPE "public"."FlagStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- AlterTable
ALTER TABLE "public"."reviews" ADD COLUMN     "isFlagged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable - Add ban fields to users table
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "banReason" TEXT;
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "bannedAt" TIMESTAMP(3);
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "bannedBy" TEXT;

-- AlterTable - Add ban fields to vendor_profiles table
ALTER TABLE "public"."vendor_profiles" ADD COLUMN IF NOT EXISTS "banReason" TEXT,
ADD COLUMN IF NOT EXISTS "bannedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "bannedBy" TEXT,
ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."content_flags" (
    "id" TEXT NOT NULL,
    "type" "public"."FlagType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."FlagStatus" NOT NULL DEFAULT 'PENDING',
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "reportedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "content_flags_status_idx" ON "public"."content_flags"("status");

-- CreateIndex
CREATE INDEX "content_flags_type_idx" ON "public"."content_flags"("type");

-- CreateIndex
CREATE INDEX "content_flags_createdAt_idx" ON "public"."content_flags"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."content_flags" ADD CONSTRAINT "content_flags_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_flags" ADD CONSTRAINT "content_flags_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
