"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui";
import { inputClassName } from "@/components/forms";

type EmailSignupFormProps = {
  source: "footer" | "home" | "other";
  buttonLabel?: string;
  successMessage?: string;
};

export function EmailSignupForm({
  source,
  buttonLabel = "Notify me",
  successMessage = "You're on the list.",
}: EmailSignupFormProps) {
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
    return <p className="text-sm text-copper-light">{successMessage}</p>;
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
