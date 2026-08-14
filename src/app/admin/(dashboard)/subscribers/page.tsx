"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading } from "@/components/ui";
import { formatDateTime } from "@/lib/format";

type Subscriber = {
  id: string;
  email: string;
  firstName?: string | null;
  source?: string | null;
  subscribedAt: string;
  unsubscribedAt?: string | null;
};

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/subscribe")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to load subscribers");
        setSubscribers(data.subscribers ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load subscribers"));
  }, []);

  const active = subscribers.filter((s) => !s.unsubscribedAt);

  function exportCsv() {
    const lines = ["email,first_name,source,subscribed_at,status"];
    for (const row of subscribers) {
      lines.push(
        [
          csvEscape(row.email),
          csvEscape(row.firstName ?? ""),
          csvEscape(row.source ?? ""),
          csvEscape(row.subscribedAt),
          row.unsubscribedAt ? "unsubscribed" : "active",
        ].join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "subscribers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-copper-light hover:underline">
        ← Back to dashboard
      </Link>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <PageHeading
          title="Website subscribers"
          subtitle={`${active.length} active · ${subscribers.length} total`}
        />
        <Button variant="secondary" onClick={exportCsv} disabled={subscribers.length === 0}>
          Export CSV
        </Button>
      </div>

      {error ? <p className="text-red-400">{error}</p> : null}

      <Card>
        {subscribers.length === 0 && !error ? (
          <p className="text-stone-400">No subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm text-stone-400">
              <thead>
                <tr className="border-b border-stone-700 text-stone-200">
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">First name</th>
                  <th className="px-3 py-2 font-medium">Source</th>
                  <th className="px-3 py-2 font-medium">Subscribed</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-stone-800">
                    <td className="px-3 py-2 text-stone-200">{subscriber.email}</td>
                    <td className="px-3 py-2">{subscriber.firstName ?? "—"}</td>
                    <td className="px-3 py-2">{subscriber.source ?? "—"}</td>
                    <td className="px-3 py-2">{formatDateTime(subscriber.subscribedAt)}</td>
                    <td className="px-3 py-2">
                      {subscriber.unsubscribedAt ? "Unsubscribed" : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
