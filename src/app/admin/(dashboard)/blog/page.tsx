"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading } from "@/components/ui";
import { formatDate, formatDateTime } from "@/lib/format";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
  publishedAt?: string | null;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/blog?admin=1");
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to load posts");
      return;
    }
    setPosts(data.posts ?? []);
  }

  useEffect(() => {
    load().catch(() => setMessage("Unable to load posts"));
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const response = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to delete");
      return;
    }
    setPosts((current) => current.filter((post) => post.id !== id));
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-copper-light hover:underline">
        ← Back to dashboard
      </Link>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <PageHeading title="Blog" subtitle="Draft, publish, and edit journal posts." />
        <Button href="/admin/blog/new">New post</Button>
      </div>
      {message ? <p className="mb-4 text-sm text-copper-light">{message}</p> : null}
      {posts.length === 0 ? (
        <Card>
          <p className="text-stone-400">No posts yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/blog/${post.id}`} className="text-lg font-medium text-stone-100 hover:text-copper-light">
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-stone-500">
                    /blog/{post.slug} · {post.status === "published" ? "Published" : "Draft"}
                    {post.status === "published" && post.publishedAt
                      ? ` ${formatDate(post.publishedAt)}`
                      : ""}{" "}
                    · Updated {formatDateTime(post.updatedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button href={`/admin/blog/${post.id}`} variant="secondary">
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => remove(post.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
