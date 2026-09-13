-- Finish option groups, incompatibilities, order snapshots, and blog.

CREATE TYPE "metal"."BlogPostStatus" AS ENUM ('draft', 'published');

CREATE TABLE "metal"."ProductOptionGroup" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductOptionGroup_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductOptionGroup_productId_idx" ON "metal"."ProductOptionGroup"("productId");

ALTER TABLE "metal"."ProductOptionGroup"
  ADD CONSTRAINT "ProductOptionGroup_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "metal"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "metal"."ProductOption" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "priceDeltaCents" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductOption_groupId_idx" ON "metal"."ProductOption"("groupId");

ALTER TABLE "metal"."ProductOption"
  ADD CONSTRAINT "ProductOption_groupId_fkey"
  FOREIGN KEY ("groupId") REFERENCES "metal"."ProductOptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "metal"."ProductOptionIncompatibility" (
    "id" TEXT NOT NULL,
    "optionAId" TEXT NOT NULL,
    "optionBId" TEXT NOT NULL,
    CONSTRAINT "ProductOptionIncompatibility_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductOptionIncompatibility_optionAId_optionBId_key"
  ON "metal"."ProductOptionIncompatibility"("optionAId", "optionBId");
CREATE INDEX "ProductOptionIncompatibility_optionBId_idx"
  ON "metal"."ProductOptionIncompatibility"("optionBId");

ALTER TABLE "metal"."ProductOptionIncompatibility"
  ADD CONSTRAINT "ProductOptionIncompatibility_optionAId_fkey"
  FOREIGN KEY ("optionAId") REFERENCES "metal"."ProductOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "metal"."ProductOptionIncompatibility"
  ADD CONSTRAINT "ProductOptionIncompatibility_optionBId_fkey"
  FOREIGN KEY ("optionBId") REFERENCES "metal"."ProductOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "metal"."OrderSelectedOption" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "optionName" TEXT NOT NULL,
    "priceDeltaCents" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "OrderSelectedOption_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OrderSelectedOption_orderId_idx" ON "metal"."OrderSelectedOption"("orderId");

ALTER TABLE "metal"."OrderSelectedOption"
  ADD CONSTRAINT "OrderSelectedOption_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "metal"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "metal"."BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "coverImagePath" TEXT,
    "status" "metal"."BlogPostStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "authorName" TEXT NOT NULL DEFAULT 'Shay',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BlogPost_slug_key" ON "metal"."BlogPost"("slug");
CREATE INDEX "BlogPost_status_publishedAt_idx" ON "metal"."BlogPost"("status", "publishedAt");
