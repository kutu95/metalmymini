"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading } from "@/components/ui";
import { FormField, inputClassName } from "@/components/forms";

export default function AdminPricingPage() {
  const [priceAud, setPriceAud] = useState(45);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.displayCopperPriceAud === "number") {
          setPriceAud(data.displayCopperPriceAud);
        }
      })
      .catch(() => setMessage("Unable to load current price"));
  }, []);

  async function savePrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayCopperPriceAud: priceAud }),
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error ?? "Unable to save price");
      return;
    }

    setPriceAud(data.displayCopperPriceAud);
    setMessage(`Display Copper is now ${data.displayCopperPriceDisplay}. New orders will use this price.`);
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-copper-light hover:underline">
        ← Back to dashboard
      </Link>
      <PageHeading
        title="Pricing"
        subtitle="Set the Display Copper price shown on the site and charged at checkout."
      />

      <Card className="max-w-md">
        <form onSubmit={savePrice} className="space-y-4">
          <FormField
            label="Display Copper price (AUD)"
            hint="This updates the homepage, order form, and Stripe checkout for new orders. Existing orders keep the price they were charged."
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                $
              </span>
              <input
                type="number"
                min={1}
                max={5000}
                step={0.01}
                value={priceAud}
                onChange={(e) => setPriceAud(Number(e.target.value))}
                className={`${inputClassName} pl-7`}
                required
              />
            </div>
          </FormField>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save price"}
          </Button>
        </form>
        {message ? <p className="mt-4 text-sm text-copper-light">{message}</p> : null}
      </Card>
    </div>
  );
}
