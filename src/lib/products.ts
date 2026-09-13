import { prisma } from "@/lib/db";
import { formatPriceDisplay } from "@/lib/site-settings";
import { listProductCatalog, type CatalogOptionGroup, type IncompatibilityPair } from "@/lib/product-options";

export type ProductWithThumbnail = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  priceDisplay: string;
  active: boolean;
  sortOrder: number;
  galleryItemId: string | null;
  thumbnailUrl: string | null;
  optionGroups: CatalogOptionGroup[];
  incompatibilities: IncompatibilityPair[];
};

function mapProduct(
  product: {
    id: string;
    name: string;
    description: string;
    priceCents: number;
    active: boolean;
    sortOrder: number;
    galleryItemId: string | null;
    galleryItem?: { imagePath: string } | null;
  },
  catalog: { optionGroups: CatalogOptionGroup[]; incompatibilities: IncompatibilityPair[] },
): ProductWithThumbnail {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    priceDisplay: formatPriceDisplay(product.priceCents),
    active: product.active,
    sortOrder: product.sortOrder,
    galleryItemId: product.galleryItemId,
    thumbnailUrl: product.galleryItem
      ? `/api/files/gallery/${product.galleryItem.imagePath}`
      : null,
    optionGroups: catalog.optionGroups,
    incompatibilities: catalog.incompatibilities,
  };
}

export async function listProducts(options?: { activeOnly?: boolean; admin?: boolean }) {
  const products = await prisma.product.findMany({
    where: options?.activeOnly ? { active: true } : undefined,
    include: { galleryItem: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return Promise.all(
    products.map(async (product) =>
      mapProduct(product, await listProductCatalog(product.id, { admin: options?.admin })),
    ),
  );
}

export async function getActiveProduct(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, active: true },
    include: { galleryItem: true },
  });
  if (!product) return null;
  return mapProduct(product, await listProductCatalog(product.id));
}

export async function getProductById(productId: string, options?: { admin?: boolean }) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { galleryItem: true },
  });
  if (!product) return null;
  return mapProduct(product, await listProductCatalog(product.id, { admin: options?.admin }));
}
