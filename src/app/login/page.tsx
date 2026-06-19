import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { AuthForm } from "@/components/AuthForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Log In",
  description: "Log in to Metal My Mini to view your orders and reorder from stored model files.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div>
      <PageHeading title="Log in" subtitle="Access your order history and reorder from stored files." />
      <AuthForm mode="login" />
      <p className="mt-4 text-sm text-stone-400">
        No account? <Link href="/signup" className="text-copper-light hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
