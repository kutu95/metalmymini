import Link from "next/link";
import { PageHeading } from "@/components/ui";
import { AdminBlogEditor } from "@/components/AdminBlogEditor";

export default function NewBlogPostPage() {
  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-copper-light hover:underline">
        ← Back to posts
      </Link>
      <PageHeading title="New post" subtitle="Save as a draft, then publish when it is ready." />
      <AdminBlogEditor />
    </div>
  );
}
