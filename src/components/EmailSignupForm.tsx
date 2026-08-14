"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui";
import { inputClassName } from "@/components/forms";

export function EmailSignupForm({
  source,
  buttonLabel = "Notify me",
}: {
  source: "footer" | "home" | "other";
  buttonLabel?: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName.trim() || undefined,
          source,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    const heading = firstName.trim()
      ? `Thanks, ${firstName.trim()} — you're subscribed.`
      : "Thanks — you're subscribed.";

    return (
      <div
        className="rounded-md border border-copper/30 bg-copper/10 px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <p className="font-medium text-stone-100">{heading}</p>
        <p className="mt-1 text-sm text-stone-400">
          I&apos;ll be in touch when there&apos;s news worth sharing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor={`first-name-${source}`} className="mb-1 block text-xs text-stone-500">
          First name (optional)
        </label>
        <input
          id={`first-name-${source}`}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          placeholder="First name"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`email-${source}`} className="mb-1 block text-xs text-stone-500">
          Email
        </label>
        <input
          id={`email-${source}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          className={inputClassName}
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" variant="secondary" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : buttonLabel}
      </Button>
    </form>
  );
}
