"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading } from "@/components/ui";
import { FormField, textareaClassName } from "@/components/forms";

type OrderPageSettings = {
  bannerEnabled: boolean;
  bannerMessage: string;
  orderingPaused: boolean;
  orderingPausedMessage: string;
};

export default function AdminOrderPageSettings() {
  const [form, setForm] = useState<OrderPageSettings>({
    bannerEnabled: false,
    bannerMessage: "",
    orderingPaused: false,
    orderingPausedMessage: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/site-settings")
      .then(async (response) => {
        const data = await response.json();
        setForm({
          bannerEnabled: Boolean(data.bannerEnabled),
          bannerMessage: data.bannerMessage ?? "",
          orderingPaused: Boolean(data.orderingPaused),
          orderingPausedMessage: data.orderingPausedMessage ?? "",
        });
      })
      .catch(() => setMessage("Unable to load order page settings"));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error ?? "Unable to save settings");
      return;
    }
    setForm({
      bannerEnabled: Boolean(data.bannerEnabled),
      bannerMessage: data.bannerMessage ?? "",
      orderingPaused: Boolean(data.orderingPaused),
      orderingPausedMessage: data.orderingPausedMessage ?? "",
    });
    setMessage("Order page settings saved.");
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-copper-light hover:underline">
        ← Back to dashboard
      </Link>
      <PageHeading
        title="Order page"
        subtitle="Show a banner on the order form, or pause new orders so customers can join a waitlist instead of paying."
      />

      <form onSubmit={save} className="grid gap-8 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-medium text-stone-100">Banner</h2>
          <p className="mt-2 text-sm text-stone-400">
            Use this for backlog notes or other short alerts. Leave it off when you do not need it.
          </p>
          <label className="mt-6 flex items-center gap-3 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={form.bannerEnabled}
              onChange={(e) => setForm({ ...form, bannerEnabled: e.target.checked })}
            />
            Show banner on the order page
          </label>
          <div className="mt-4">
            <FormField label="Banner text" hint="Plain text only. Line breaks are kept.">
              <textarea
                value={form.bannerMessage}
                onChange={(e) => setForm({ ...form, bannerMessage: e.target.value })}
                rows={5}
                className={textareaClassName}
                placeholder="There's a current backlog — expect a longer turnaround."
              />
            </FormField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-stone-100">Pause ordering</h2>
          <p className="mt-2 text-sm text-stone-400">
            Replaces the order form with an email waitlist. New orders are blocked so you do not take
            payments you cannot fulfil.
          </p>
          <label className="mt-6 flex items-center gap-3 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={form.orderingPaused}
              onChange={(e) => setForm({ ...form, orderingPaused: e.target.checked })}
            />
            Pause new orders
          </label>
          {form.orderingPaused ? (
            <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              The upload form is hidden. Waitlist emails show under Subscribers as source
              “order_waitlist”.
            </p>
          ) : null}
          <div className="mt-4">
            <FormField label="Paused-page message">
              <textarea
                value={form.orderingPausedMessage}
                onChange={(e) => setForm({ ...form, orderingPausedMessage: e.target.value })}
                rows={5}
                className={textareaClassName}
                placeholder="I'm not taking new orders right now."
              />
            </FormField>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </Button>
          {message ? <p className="mt-4 text-sm text-copper-light">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
