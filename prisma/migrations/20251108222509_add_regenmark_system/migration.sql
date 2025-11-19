-- CreateEnum
CREATE TYPE "public"."NFTLevel" AS ENUM ('VERDE_CLARO', 'HOJA_ACTIVA', 'ECO_GUARDIA', 'ESTRELLA_VERDE', 'HUELLA_CERO');

-- CreateEnum
CREATE TYPE "public"."RegenMarkType" AS ENUM ('CARBON_SAVER', 'WATER_GUARDIAN', 'CIRCULAR_CHAMPION', 'HUMAN_FIRST', 'HUMANE_HERO');

-- CreateEnum
CREATE TYPE "public"."RegenMarkStatus" AS ENUM ('PENDING', 'IN_EVALUATION', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'SUSPENDED', 'REVOKED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."EvaluationStatus" AS ENUM ('PENDING', 'PAID', 'SUBMITTED', 'AI_PROCESSING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."EvaluationStage" AS ENUM ('PAYMENT', 'SUBMITTED', 'AI_ANALYSIS', 'MANUAL_REVIEW', 'FINAL_REVIEW', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('CARBON_FOOTPRINT_REPORT', 'ENERGY_BILLS', 'CARBON_OFFSET_CERTIFICATE', 'ISO_14001_CERTIFICATE', 'WATER_BILLS', 'WATER_RECYCLING_EVIDENCE', 'WATER_AUDIT_REPORT', 'WATER_TREATMENT_PHOTOS', 'WASTE_MANAGEMENT_RECORDS', 'RECYCLING_CONTRACTS', 'CIRCULAR_ECONOMY_EVIDENCE', 'ZERO_WASTE_CERTIFICATE', 'LABOR_POLICY_DOCUMENT', 'COMMUNITY_PROGRAMS_EVIDENCE', 'SUSTAINABILITY_REPORT', 'B_CORP_CERTIFICATE', 'FAIR_TRADE_CERTIFICATE', 'CRUELTY_FREE_CERTIFICATE', 'ANIMAL_WELFARE_AUDIT', 'NO_TESTING_POLICY', 'ETHICAL_SUPPLY_CHAIN_CERT', 'BUSINESS_LICENSE', 'TAX_DOCUMENT', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."NotificationType" ADD VALUE 'REGENMARK_SUBMITTED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'REGENMARK_APPROVED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'REGENMARK_REJECTED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'REGENMARK_EXPIRING';
ALTER TYPE "public"."NotificationType" ADD VALUE 'REGENMARK_EXPIRED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'NFT_LEVEL_UP';
ALTER TYPE "public"."NotificationType" ADD VALUE 'NFT_LEVEL_DOWN';

-- AlterTable
ALTER TABLE "public"."vendor_profiles" ADD COLUMN     "metricsLastUpdated" TIMESTAMP(3),
ADD COLUMN     "metricsVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metricsVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "metricsVerifiedBy" TEXT,
ADD COLUMN     "nftLevel" "public"."NFTLevel" NOT NULL DEFAULT 'VERDE_CLARO',
ADD COLUMN     "sustainabilityMetrics" JSONB;

-- CreateTable
CREATE TABLE "public"."regen_marks" (
    "id" TEXT NOT NULL,
    "vendorProfileId" TEXT NOT NULL,
    "type" "public"."RegenMarkType" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "status" "public"."RegenMarkStatus" NOT NULL DEFAULT 'PENDING',
    "level" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "lastRenewedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "metrics" JSONB,
    "evidence" JSONB,
    "evaluationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regen_marks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."regen_mark_evaluations" (
    "id" TEXT NOT NULL,
    "regenMarkId" TEXT,
    "vendorProfileId" TEXT NOT NULL,
    "type" "public"."RegenMarkType" NOT NULL,
    "status" "public"."EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "stage" "public"."EvaluationStage" NOT NULL DEFAULT 'SUBMITTED',
    "aiProcessed" BOOLEAN NOT NULL DEFAULT false,
    "aiScore" INTEGER DEFAULT 0,
    "aiFlags" JSONB,
    "aiProcessedAt" TIMESTAMP(3),
    "reviewerId" TEXT,
    "reviewerNotes" TEXT,
    "reviewScore" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "finalScore" INTEGER,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "feedback" TEXT,
    "paymentAmount" DECIMAL(10,2),
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentId" TEXT,
    "submittedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regen_mark_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" TEXT NOT NULL,
    "regenMarkEvaluationId" TEXT,
    "regenMarkId" TEXT,
    "type" "public"."DocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "aiExtractedData" JSONB,
    "aiVerified" BOOLEAN NOT NULL DEFAULT false,
    "aiFlags" JSONB,
    "manuallyVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verificationNotes" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "regen_marks_vendorProfileId_idx" ON "public"."regen_marks"("vendorProfileId");

-- CreateIndex
CREATE INDEX "regen_marks_type_idx" ON "public"."regen_marks"("type");

-- CreateIndex
CREATE INDEX "regen_marks_status_idx" ON "public"."regen_marks"("status");

-- CreateIndex
CREATE INDEX "regen_marks_expiresAt_idx" ON "public"."regen_marks"("expiresAt");

-- CreateIndex
CREATE INDEX "regen_mark_evaluations_vendorProfileId_idx" ON "public"."regen_mark_evaluations"("vendorProfileId");

-- CreateIndex
CREATE INDEX "regen_mark_evaluations_status_idx" ON "public"."regen_mark_evaluations"("status");

-- CreateIndex
CREATE INDEX "regen_mark_evaluations_stage_idx" ON "public"."regen_mark_evaluations"("stage");

-- CreateIndex
CREATE INDEX "regen_mark_evaluations_type_idx" ON "public"."regen_mark_evaluations"("type");

-- CreateIndex
CREATE INDEX "documents_regenMarkEvaluationId_idx" ON "public"."documents"("regenMarkEvaluationId");

-- CreateIndex
CREATE INDEX "documents_regenMarkId_idx" ON "public"."documents"("regenMarkId");

-- CreateIndex
CREATE INDEX "documents_type_idx" ON "public"."documents"("type");

-- CreateIndex
CREATE INDEX "vendor_profiles_nftLevel_idx" ON "public"."vendor_profiles"("nftLevel");

-- CreateIndex
CREATE INDEX "vendor_profiles_regenScore_idx" ON "public"."vendor_profiles"("regenScore");

-- AddForeignKey
ALTER TABLE "public"."regen_marks" ADD CONSTRAINT "regen_marks_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "public"."vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regen_mark_evaluations" ADD CONSTRAINT "regen_mark_evaluations_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "public"."vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regen_mark_evaluations" ADD CONSTRAINT "regen_mark_evaluations_regenMarkId_fkey" FOREIGN KEY ("regenMarkId") REFERENCES "public"."regen_marks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_regenMarkEvaluationId_fkey" FOREIGN KEY ("regenMarkEvaluationId") REFERENCES "public"."regen_mark_evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_regenMarkId_fkey" FOREIGN KEY ("regenMarkId") REFERENCES "public"."regen_marks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
