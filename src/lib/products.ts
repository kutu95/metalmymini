import { prisma } from "@/lib/db";
import { formatPriceDisplay } from "@/lib/site-settings";

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
};

function mapProduct(product: {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  active: boolean;
  sortOrder: number;
  galleryItemId: string | null;
  galleryItem?: { imagePath: string } | null;
}): ProductWithThumbnail {
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
  };
}

export async function listProducts(options?: { activeOnly?: boolean; admin?: boolean }) {
  const products = await prisma.product.findMany({
    where: options?.activeOnly ? { active: true } : undefined,
    include: { galleryItem: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return products.map(mapProduct);
}

export async function getActiveProduct(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, active: true },
    include: { galleryItem: true },
  });
  return product ? mapProduct(product) : null;
}

export async function getProductById(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { galleryItem: true },
  });
  return product ? mapProduct(product) : null;
}
