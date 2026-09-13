"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui";
import { FormField, inputClassName, textareaClassName } from "@/components/forms";
import { formatAud } from "@/lib/format";

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

export type IncompatibilityPair = {
  id: string;
  optionAId: string;
  optionBId: string;
};

export type ProductWithOptions = {
  id: string;
  name: string;
  optionGroups: CatalogOptionGroup[];
  incompatibilities: IncompatibilityPair[];
};

export function ProductOptionsEditor({
  product,
  onProductChange,
}: {
  product: ProductWithOptions;
  onProductChange: (product: ProductWithOptions) => void;
}) {
  const [message, setMessage] = useState("");
  const [groupForm, setGroupForm] = useState({ name: "", description: "", required: true, sortOrder: 0 });
  const [optionForms, setOptionForms] = useState<Record<string, { name: string; description: string; priceDeltaAud: number }>>(
    {},
  );
  const [pair, setPair] = useState({ optionAId: "", optionBId: "" });

  const allOptions = product.optionGroups.flatMap((group) =>
    group.options.map((option) => ({ ...option, groupName: group.name })),
  );

  function optionLabel(optionId: string) {
    const match = allOptions.find((option) => option.id === optionId);
    return match ? `${match.groupName}: ${match.name}` : optionId;
  }

  async function applyResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to save");
      return;
    }
    if (data.product) onProductChange(data.product);
    setMessage("");
  }

  async function addGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/products/${product.id}/option-groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groupForm),
    });
    await applyResponse(response);
    if (response.ok) setGroupForm({ name: "", description: "", required: true, sortOrder: 0 });
  }

  async function patchGroup(groupId: string, body: Record<string, unknown>) {
    const response = await fetch(`/api/products/${product.id}/option-groups/${groupId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await applyResponse(response);
  }

  async function deleteGroup(groupId: string) {
    if (!confirm("Delete this option group and its choices?")) return;
    const response = await fetch(`/api/products/${product.id}/option-groups/${groupId}`, {
      method: "DELETE",
    });
    await applyResponse(response);
  }

  async function addOption(groupId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = optionForms[groupId] ?? { name: "", description: "", priceDeltaAud: 0 };
    const response = await fetch(`/api/products/${product.id}/option-groups/${groupId}/options`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    await applyResponse(response);
    if (response.ok) {
      setOptionForms((current) => ({
        ...current,
        [groupId]: { name: "", description: "", priceDeltaAud: 0 },
      }));
    }
  }

  async function patchOption(optionId: string, body: Record<string, unknown>) {
    const response = await fetch(`/api/product-options/${optionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await applyResponse(response);
  }

  async function deleteOption(optionId: string) {
    if (!confirm("Delete this choice?")) return;
    const response = await fetch(`/api/product-options/${optionId}`, { method: "DELETE" });
    await applyResponse(response);
  }

  async function addIncompatibility(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/products/${product.id}/incompatibilities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pair),
    });
    await applyResponse(response);
    if (response.ok) setPair({ optionAId: "", optionBId: "" });
  }

  async function deleteIncompatibility(incompatibilityId: string) {
    const response = await fetch(
      `/api/products/${product.id}/incompatibilities?incompatibilityId=${encodeURIComponent(incompatibilityId)}`,
      { method: "DELETE" },
    );
    await applyResponse(response);
  }

  return (
    <div className="mt-8 space-y-6 border-t border-stone-800 pt-6">
      <div>
        <h3 className="text-base font-medium text-stone-100">Sub-options</h3>
        <p className="mt-1 text-sm text-stone-500">
          Groups are single-choice (for example Patina, then Sealing). Mark pairs that cannot go together.
        </p>
      </div>

      {product.optionGroups.map((group) => {
        const optionForm = optionForms[group.id] ?? { name: "", description: "", priceDeltaAud: 0 };
        return (
          <div key={group.id} className="rounded-lg border border-stone-800 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-stone-100">{group.name}</p>
                {group.description ? <p className="mt-1 text-sm text-stone-500">{group.description}</p> : null}
                <p className="mt-1 text-xs text-stone-500">
                  {group.required ? "Required" : "Optional"} · sort {group.sortOrder} ·{" "}
                  {group.active ? "Active" : "Hidden"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => patchGroup(group.id, { active: !group.active })}>
                  {group.active ? "Hide" : "Show"}
                </Button>
                <Button variant="ghost" onClick={() => deleteGroup(group.id)}>
                  Delete group
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {group.options.map((option) => (
                <div
                  key={option.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-stone-800 bg-black/30 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="text-stone-200">{option.name}</span>
                    <span className="ml-2 text-copper-light">
                      {option.priceDeltaCents === 0 ? "Included" : formatAud(option.priceDeltaCents)}
                    </span>
                    {!option.active ? <span className="ml-2 text-stone-500">Hidden</span> : null}
                    {option.description ? (
                      <p className="mt-1 text-xs text-stone-500">{option.description}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => patchOption(option.id, { active: !option.active })}>
                      {option.active ? "Hide" : "Show"}
                    </Button>
                    <Button variant="ghost" onClick={() => deleteOption(option.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={(event) => addOption(group.id, event)} className="mt-4 grid gap-3 md:grid-cols-[1fr_6rem_auto]">
              <input
                value={optionForm.name}
                onChange={(e) =>
                  setOptionForms((current) => ({
                    ...current,
                    [group.id]: { ...optionForm, name: e.target.value },
                  }))
                }
                required
                placeholder="Choice name"
                className={inputClassName}
              />
              <input
                type="number"
                step={0.01}
                value={optionForm.priceDeltaAud}
                onChange={(e) =>
                  setOptionForms((current) => ({
                    ...current,
                    [group.id]: { ...optionForm, priceDeltaAud: Number(e.target.value) },
                  }))
                }
                className={inputClassName}
                title="Extra price AUD"
              />
              <Button type="submit" variant="secondary">
                Add choice
              </Button>
            </form>
          </div>
        );
      })}

      <form onSubmit={addGroup} className="space-y-3 rounded-lg border border-dashed border-stone-700 p-4">
        <p className="text-sm font-medium text-stone-200">Add option group</p>
        <FormField label="Group name">
          <input
            value={groupForm.name}
            onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
            required
            placeholder="Patina"
            className={inputClassName}
          />
        </FormField>
        <FormField label="Description">
          <textarea
            value={groupForm.description}
            onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
            rows={2}
            className={textareaClassName}
          />
        </FormField>
        <label className="flex items-center gap-3 text-sm text-stone-300">
          <input
            type="checkbox"
            checked={groupForm.required}
            onChange={(e) => setGroupForm({ ...groupForm, required: e.target.checked })}
          />
          Required — customer must pick one
        </label>
        <Button type="submit" variant="secondary">
          Add group
        </Button>
      </form>

      {allOptions.length >= 2 ? (
        <div className="space-y-3 rounded-lg border border-stone-800 p-4">
          <p className="text-sm font-medium text-stone-200">Incompatible pairs</p>
          <p className="text-xs text-stone-500">
            Example: a specific oxidisation choice cannot be combined with Sealed.
          </p>
          {product.incompatibilities.length === 0 ? (
            <p className="text-sm text-stone-500">No incompatibilities yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {product.incompatibilities.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 text-stone-300">
                  <span>
                    {optionLabel(row.optionAId)} cannot go with {optionLabel(row.optionBId)}
                  </span>
                  <Button variant="ghost" onClick={() => deleteIncompatibility(row.id)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={addIncompatibility} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <select
              value={pair.optionAId}
              onChange={(e) => setPair({ ...pair, optionAId: e.target.value })}
              required
              className={inputClassName}
            >
              <option value="">First option</option>
              {allOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.groupName}: {option.name}
                </option>
              ))}
            </select>
            <select
              value={pair.optionBId}
              onChange={(e) => setPair({ ...pair, optionBId: e.target.value })}
              required
              className={inputClassName}
            >
              <option value="">Second option</option>
              {allOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.groupName}: {option.name}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary">
              Add pair
            </Button>
          </form>
        </div>
      ) : null}

      {message ? <p className="text-sm text-copper-light">{message}</p> : null}
    </div>
  );
}
