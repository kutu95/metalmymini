-- Multiple model files per order via OrderItem.

CREATE TABLE "metal"."OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "uploadedFileId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OrderItem_uploadedFileId_key" ON "metal"."OrderItem"("uploadedFileId");
CREATE INDEX "OrderItem_orderId_idx" ON "metal"."OrderItem"("orderId");

ALTER TABLE "metal"."OrderItem"
  ADD CONSTRAINT "OrderItem_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "metal"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "metal"."OrderItem"
  ADD CONSTRAINT "OrderItem_uploadedFileId_fkey"
  FOREIGN KEY ("uploadedFileId") REFERENCES "metal"."UploadedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "metal"."OrderItem" ("id", "orderId", "uploadedFileId", "quantity", "sortOrder", "createdAt")
SELECT
  'oi_' || o."id",
  o."id",
  o."uploadedFileId",
  GREATEST(o."quantity", 1),
  0,
  o."createdAt"
FROM "metal"."Order" o
WHERE o."uploadedFileId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "metal"."OrderItem" oi WHERE oi."orderId" = o."id"
  );

ALTER TABLE "metal"."Order" DROP CONSTRAINT IF EXISTS "Order_uploadedFileId_fkey";
DROP INDEX IF EXISTS "metal"."Order_uploadedFileId_key";
ALTER TABLE "metal"."Order" DROP COLUMN IF EXISTS "uploadedFileId";
