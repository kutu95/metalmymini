-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "metal";

-- CreateEnum
CREATE TYPE "metal"."Role" AS ENUM ('customer', 'admin');

-- CreateEnum
CREATE TYPE "metal"."ProductOption" AS ENUM ('cosmetic_copper', 'heavy_duty_copper');

-- CreateEnum
CREATE TYPE "metal"."PaymentStatus" AS ENUM ('unpaid', 'paid', 'refunded', 'failed');

-- CreateEnum
CREATE TYPE "metal"."ProductionStatus" AS ENUM ('submitted', 'paid', 'human_review', 'approved', 'printing', 'plating', 'polishing', 'packaging', 'shipped', 'completed', 'awaiting_customer_action', 'additional_payment_required', 'rejected', 'refunded', 'cancelled');

-- CreateTable
CREATE TABLE "metal"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "metal"."Role" NOT NULL DEFAULT 'customer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metal"."Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "productOption" "metal"."ProductOption" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "shippingPrice" INTEGER,
    "paymentStatus" "metal"."PaymentStatus" NOT NULL DEFAULT 'unpaid',
    "productionStatus" "metal"."ProductionStatus" NOT NULL DEFAULT 'submitted',
    "uploadedFileId" TEXT NOT NULL,
    "termsAccepted" BOOLEAN NOT NULL,
    "publicGalleryConsentAccepted" BOOLEAN NOT NULL,
    "adminNotes" TEXT,
    "customerNotes" TEXT,
    "trackingNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metal"."UploadedFile" (
    "id" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "storedFilename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metal"."GalleryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "finishType" "metal"."ProductOption" NOT NULL,
    "imagePath" TEXT NOT NULL,
    "relatedOrderId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metal"."OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "metal"."ProductionStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "metal"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "metal"."Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_uploadedFileId_key" ON "metal"."Order"("uploadedFileId");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFile_storedFilename_key" ON "metal"."UploadedFile"("storedFilename");

-- AddForeignKey
ALTER TABLE "metal"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "metal"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metal"."Order" ADD CONSTRAINT "Order_uploadedFileId_fkey" FOREIGN KEY ("uploadedFileId") REFERENCES "metal"."UploadedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metal"."GalleryItem" ADD CONSTRAINT "GalleryItem_relatedOrderId_fkey" FOREIGN KEY ("relatedOrderId") REFERENCES "metal"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metal"."OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "metal"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
