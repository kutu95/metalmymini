import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser().catch(() => null);

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  return children;
}
