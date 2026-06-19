import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { AuthForm } from "@/components/AuthForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Create Account",
  description: "Create a Metal My Mini account to track orders and reorder from stored model files.",
  path: "/signup",
  noIndex: true,
});

export default function SignupPage() {
  return (
    <div>
      <PageHeading title="Create account" subtitle="Optional — you can also order as a guest." />
      <AuthForm mode="signup" />
      <p className="mt-4 text-sm text-stone-400">
        Already have an account? <Link href="/login" className="text-copper-light hover:underline">Log in</Link>
      </p>
    </div>
  );
}
