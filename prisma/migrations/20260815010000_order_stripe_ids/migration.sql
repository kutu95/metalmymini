-- AlterTable
ALTER TABLE "metal"."Order" ADD COLUMN "stripeCheckoutSessionId" TEXT;
ALTER TABLE "metal"."Order" ADD COLUMN "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeCheckoutSessionId_key" ON "metal"."Order"("stripeCheckoutSessionId");
