/*
  Warnings:

  - You are about to drop the column `vendorId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `products` table. All the data in the column will be lost.
  - Added the required column `vendorUserId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorUserId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."NotificationType" ADD VALUE 'VENDOR_APPROVED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'VENDOR_REJECTED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'VENDOR_IN_REVIEW';

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_vendorId_fkey";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "vendorId",
ADD COLUMN     "vendorUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "vendorId",
ADD COLUMN     "vendorUserId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "public"."orders"("userId");

-- CreateIndex
CREATE INDEX "orders_vendorUserId_idx" ON "public"."orders"("vendorUserId");

-- CreateIndex
CREATE INDEX "products_vendorUserId_idx" ON "public"."products"("vendorUserId");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_vendorUserId_fkey" FOREIGN KEY ("vendorUserId") REFERENCES "public"."vendor_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_vendorUserId_fkey" FOREIGN KEY ("vendorUserId") REFERENCES "public"."vendor_profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
