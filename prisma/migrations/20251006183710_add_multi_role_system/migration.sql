-- CreateEnum
CREATE TYPE "public"."OnboardingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'CUSTOMER';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "favoriteCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sustainabilityInterests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "priceRange" TEXT,
    "preferredPaymentMethod" TEXT,
    "preferredShippingMethod" TEXT,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "averageOrderValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "loyaltyTier" TEXT NOT NULL DEFAULT 'BRONZE',
    "rewardPoints" INTEGER NOT NULL DEFAULT 0,
    "defaultAddressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vendor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessType" TEXT,
    "taxId" TEXT,
    "businessAddress" TEXT,
    "businessPhone" TEXT,
    "website" TEXT,
    "onboardingStatus" "public"."OnboardingStatus" NOT NULL DEFAULT 'PENDING',
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "onboardingData" JSONB,
    "verificationStatus" "public"."VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectionReason" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "foundedYear" INTEGER,
    "employeeCount" TEXT,
    "bankAccount" TEXT,
    "bankName" TEXT,
    "accountHolder" TEXT,
    "stripeAccountId" TEXT,
    "stripeOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "commissionRate" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "customCommission" BOOLEAN NOT NULL DEFAULT false,
    "totalProducts" INTEGER NOT NULL DEFAULT 0,
    "activeProducts" INTEGER NOT NULL DEFAULT 0,
    "totalSales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "responseTime" INTEGER,
    "fulfillmentRate" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "onTimeDeliveryRate" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspendedReason" TEXT,
    "suspendedAt" TIMESTAMP(3),
    "suspendedBy" TEXT,
    "regenScore" INTEGER NOT NULL DEFAULT 0,
    "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sustainabilityGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vendor_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "taxId" TEXT,
    "description" TEXT,
    "website" TEXT,
    "businessPhone" TEXT,
    "businessAddress" TEXT,
    "documents" JSONB,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "internalNotes" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "public"."user_roles"("userId");

-- CreateIndex
CREATE INDEX "user_roles_role_idx" ON "public"."user_roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_role_key" ON "public"."user_roles"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_userId_key" ON "public"."customer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_userId_key" ON "public"."vendor_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_stripeAccountId_key" ON "public"."vendor_profiles"("stripeAccountId");

-- CreateIndex
CREATE INDEX "vendor_profiles_verificationStatus_idx" ON "public"."vendor_profiles"("verificationStatus");

-- CreateIndex
CREATE INDEX "vendor_profiles_active_idx" ON "public"."vendor_profiles"("active");

-- CreateIndex
CREATE INDEX "vendor_applications_userId_idx" ON "public"."vendor_applications"("userId");

-- CreateIndex
CREATE INDEX "vendor_applications_status_idx" ON "public"."vendor_applications"("status");

-- CreateIndex
CREATE INDEX "vendor_applications_createdAt_idx" ON "public"."vendor_applications"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer_profiles" ADD CONSTRAINT "customer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendor_profiles" ADD CONSTRAINT "vendor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendor_applications" ADD CONSTRAINT "vendor_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
