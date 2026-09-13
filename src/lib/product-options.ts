import { prisma } from "@/lib/db";
import { formatPriceDisplay } from "@/lib/site-settings";
import {
  optionConflictsWith,
  type IncompatibilityPair,
} from "@/lib/product-option-rules";

export type { IncompatibilityPair };

export type CatalogOption = {
  id: string;
  name: string;
  description: string;
  priceDeltaCents: number;
  sortOrder: number;
  active: boolean;
};

export type CatalogOptionGroup = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  sortOrder: number;
  active: boolean;
  options: CatalogOption[];
};

export type SelectedOptionSnapshot = {
  groupName: string;
  optionName: string;
  priceDeltaCents: number;
  sortOrder: number;
};

function mapGroup(group: {
  id: string;
  name: string;
  description: string;
  required: boolean;
  sortOrder: number;
  active: boolean;
  options: Array<{
    id: string;
    name: string;
    description: string;
    priceDeltaCents: number;
    sortOrder: number;
    active: boolean;
  }>;
}): CatalogOptionGroup {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    required: group.required,
    sortOrder: group.sortOrder,
    active: group.active,
    options: group.options.map((option) => ({
      id: option.id,
      name: option.name,
      description: option.description,
      priceDeltaCents: option.priceDeltaCents,
      sortOrder: option.sortOrder,
      active: option.active,
    })),
  };
}

export async function listProductCatalog(productId: string, options?: { admin?: boolean }) {
  const groups = await prisma.productOptionGroup.findMany({
    where: {
      productId,
      ...(options?.admin ? {} : { active: true }),
    },
    include: {
      options: {
        where: options?.admin ? undefined : { active: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const optionIds = groups.flatMap((group) => group.options.map((option) => option.id));
  const incompatibilities =
    optionIds.length === 0
      ? []
      : await prisma.productOptionIncompatibility.findMany({
          where: {
            optionAId: { in: optionIds },
            optionBId: { in: optionIds },
          },
        });

  return {
    optionGroups: groups.map(mapGroup),
    incompatibilities: incompatibilities.map((row) => ({
      id: row.id,
      optionAId: row.optionAId,
      optionBId: row.optionBId,
    })),
  };
}

export function formatOptionDelta(cents: number) {
  if (cents === 0) return "Included";
  const sign = cents > 0 ? "+" : "−";
  return `${sign}${formatPriceDisplay(Math.abs(cents)).replace("AUD ", "")}`;
}

export function productNameWithOptions(productName: string, selected: SelectedOptionSnapshot[]) {
  const labels = selected.map((row) => row.optionName).filter(Boolean);
  return labels.length > 0 ? `${productName} — ${labels.join(", ")}` : productName;
}

export function resolveSelectedOptions(
  optionIds: string[],
  catalog: {
    optionGroups: CatalogOptionGroup[];
    incompatibilities: IncompatibilityPair[];
  },
): SelectedOptionSnapshot[] {
  const uniqueIds = [...new Set(optionIds.filter(Boolean))];
  const optionsById = new Map(
    catalog.optionGroups.flatMap((group) =>
      group.options.map((option) => [option.id, { group, option }] as const),
    ),
  );

  const selected: SelectedOptionSnapshot[] = [];
  const selectedIds: string[] = [];

  for (const optionId of uniqueIds) {
    const match = optionsById.get(optionId);
    if (!match || !match.group.active || !match.option.active) {
      throw new Error("One of the selected finish options is no longer available");
    }
    if (optionConflictsWith(optionId, selectedIds, catalog.incompatibilities)) {
      throw new Error(
        `${match.option.name} cannot be combined with another selected option`,
      );
    }
    selectedIds.push(optionId);
    selected.push({
      groupName: match.group.name,
      optionName: match.option.name,
      priceDeltaCents: match.option.priceDeltaCents,
      sortOrder: match.group.sortOrder,
    });
  }

  const selectedGroupIds = new Set(
    uniqueIds.map((id) => optionsById.get(id)?.group.id).filter(Boolean),
  );
  if (selectedGroupIds.size !== uniqueIds.length) {
    throw new Error("Choose only one option from each group");
  }

  for (const group of catalog.optionGroups) {
    if (!group.active) continue;
    const picked = uniqueIds.some((id) => optionsById.get(id)?.group.id === group.id);
    if (group.required && group.options.some((option) => option.active) && !picked) {
      throw new Error(`Select an option for ${group.name}`);
    }
  }

  return selected.sort((a, b) => a.sortOrder - b.sortOrder || a.groupName.localeCompare(b.groupName));
}
