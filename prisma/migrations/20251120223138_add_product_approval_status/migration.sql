/*
  Warnings:

  - You are about to drop the column `bannedBy` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ProductApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "approvalStatus" "public"."ProductApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "bannedBy",
ADD COLUMN     "banExpiresAt" TIMESTAMP(3);
