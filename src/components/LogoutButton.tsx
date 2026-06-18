"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({
  className = "text-sm text-stone-400 hover:text-copper-light",
}: {
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleLogout} disabled={loading} className={className}>
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}
