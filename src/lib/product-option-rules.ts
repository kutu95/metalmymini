export type IncompatibilityPair = {
  id?: string;
  optionAId: string;
  optionBId: string;
};

export function orderedIncompatibilityPair(optionAId: string, optionBId: string) {
  return optionAId < optionBId
    ? { optionAId, optionBId }
    : { optionAId: optionBId, optionBId: optionAId };
}

export function optionConflictsWith(
  optionId: string,
  selectedIds: string[],
  incompatibilities: IncompatibilityPair[],
) {
  return selectedIds.some((selectedId) => {
    if (selectedId === optionId) return false;
    const pair = orderedIncompatibilityPair(optionId, selectedId);
    return incompatibilities.some(
      (row) => row.optionAId === pair.optionAId && row.optionBId === pair.optionBId,
    );
  });
}
