"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { FormField, inputClassName } from "@/components/forms";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to authenticate");
      return;
    }

    if (data.role === "admin") {
      router.push("/admin");
      return;
    }

    router.push("/account/orders");
    router.refresh();
  }

  return (
    <Card className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <FormField label="Name">
            <input name="name" required className={inputClassName} />
          </FormField>
        )}
        <FormField label="Email">
          <input name="email" type="email" required className={inputClassName} />
        </FormField>
        <FormField label="Password">
          <input name="password" type="password" minLength={mode === "signup" ? 8 : 1} required className={inputClassName} />
        </FormField>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </Button>
      </form>
    </Card>
  );
}
