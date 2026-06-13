import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PageHeading } from "@/components/ui";
import { AuthForm } from "@/components/AuthForm";

export default async function AdminLoginPage() {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role === "admin") redirect("/admin");

  return (
    <div>
      <PageHeading title="Admin Login" subtitle="Sign in with your admin account." />
      <AuthForm mode="login" />
    </div>
  );
}
