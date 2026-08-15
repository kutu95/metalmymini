-- Create Product catalog and migrate off ProductOption enum.

-- 1) Product table
CREATE TABLE "metal"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "priceCents" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "galleryItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Product_galleryItemId_key" ON "metal"."Product"("galleryItemId");

-- 2) Seed Display Copper from SiteSetting price (fallback 4500)
INSERT INTO "metal"."Product" ("id", "name", "description", "priceCents", "active", "sortOrder", "createdAt", "updatedAt")
SELECT
  'seed_display_copper',
  'Display Copper',
  'A genuine copper surface, electroplated over your print and polished to a metal shine. Looks like solid bronze and takes a natural patina over time.',
  COALESCE(
    (
      SELECT CASE
        WHEN "value" ~ '^[0-9]+$' THEN "value"::INTEGER
        ELSE 4500
      END
      FROM "metal"."SiteSetting"
      WHERE "key" = 'display_copper_price_cents'
      LIMIT 1
    ),
    4500
  ),
  true,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "metal"."Product" WHERE "name" = 'Display Copper'
);

-- Seed inactive Thick Copper for historical gallery labels
INSERT INTO "metal"."Product" ("id", "name", "description", "priceCents", "active", "sortOrder", "createdAt", "updatedAt")
SELECT
  'seed_thick_copper',
  'Thick Copper',
  'Thicker jewellery-grade copper (no longer offered).',
  8000,
  false,
  99,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "metal"."Product" WHERE "name" = 'Thick Copper'
);

-- 3) Order: add productId + productName, backfill, drop productOption
ALTER TABLE "metal"."Order" ADD COLUMN IF NOT EXISTS "productId" TEXT;
ALTER TABLE "metal"."Order" ADD COLUMN IF NOT EXISTS "productName" TEXT;

UPDATE "metal"."Order" o
SET
  "productId" = CASE
    WHEN o."productOption"::text = 'heavy_duty_copper' THEN 'seed_thick_copper'
    ELSE 'seed_display_copper'
  END,
  "productName" = CASE
    WHEN o."productOption"::text = 'heavy_duty_copper' THEN 'Thick Copper'
    ELSE 'Display Copper'
  END
WHERE o."productName" IS NULL;

ALTER TABLE "metal"."Order" ALTER COLUMN "productName" SET NOT NULL;

ALTER TABLE "metal"."Order" DROP COLUMN IF EXISTS "productOption";

ALTER TABLE "metal"."Order"
  ADD CONSTRAINT "Order_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "metal"."Product"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 4) GalleryItem: replace finishType enum with productId
ALTER TABLE "metal"."GalleryItem" ADD COLUMN IF NOT EXISTS "productId" TEXT;

UPDATE "metal"."GalleryItem" g
SET "productId" = CASE
  WHEN g."finishType"::text = 'heavy_duty_copper' THEN 'seed_thick_copper'
  WHEN g."finishType"::text = 'cosmetic_copper' THEN 'seed_display_copper'
  ELSE NULL
END
WHERE g."productId" IS NULL AND g."finishType" IS NOT NULL;

ALTER TABLE "metal"."GalleryItem" DROP COLUMN IF EXISTS "finishType";

ALTER TABLE "metal"."GalleryItem"
  ADD CONSTRAINT "GalleryItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "metal"."Product"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 5) Product thumbnail FK (after GalleryItem exists without enum issues)
ALTER TABLE "metal"."Product"
  ADD CONSTRAINT "Product_galleryItemId_fkey"
  FOREIGN KEY ("galleryItemId") REFERENCES "metal"."GalleryItem"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 6) Drop ProductOption enum
DROP TYPE IF EXISTS "metal"."ProductOption";
