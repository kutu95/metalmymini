"use client";

import { useState } from "react";

export function LogoutButton({
  className = "text-sm text-stone-400 hover:text-copper-light",
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      // Full reload so the root layout re-reads the cleared session cookie.
      window.location.assign("/");
    } catch {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleLogout} disabled={loading} className={className}>
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}
