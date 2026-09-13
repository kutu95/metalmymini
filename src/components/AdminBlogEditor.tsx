"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { FormField, inputClassName, textareaClassName } from "@/components/forms";
import { slugify } from "@/lib/blog-html";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImagePath: string | null;
  status: "draft" | "published";
  seoTitle: string | null;
  seoDescription: string | null;
};

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs ${
        active ? "bg-copper/20 text-copper-light" : "text-stone-300 hover:bg-stone-800"
      }`}
    >
      {children}
    </button>
  );
}

export function AdminBlogEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const slugEdited = useRef(Boolean(post?.slug));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    coverImagePath: post?.coverImagePath ?? "",
    status: post?.status ?? "draft",
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Write the article…" }),
      Youtube.configure({
        nocookie: true,
        modestBranding: true,
        controls: true,
        rel: 0,
        width: 640,
        height: 360,
      }),
    ],
    content: post?.content || "<p></p>",
    editorProps: {
      attributes: {
        class: "blog-prose min-h-[22rem] px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && post?.content) {
      editor.commands.setContent(post.content);
    }
  }, [editor, post?.content]);

  async function uploadImage(file: File) {
    const body = new FormData();
    body.set("image", file);
    const response = await fetch("/api/blog/media", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Upload failed");
    return data as { filename: string; url: string };
  }

  async function handleInlineImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;
    try {
      const uploaded = await uploadImage(file);
      editor.chain().focus().setImage({ src: uploaded.url, alt: file.name }).run();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload image");
    }
  }

  async function handleCover(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const uploaded = await uploadImage(file);
      setForm((current) => ({ ...current, coverImagePath: uploaded.filename }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload cover");
    }
  }

  async function save(status: "draft" | "published") {
    if (!editor) return;
    setSaving(true);
    setMessage("");
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: editor.getHTML(),
      coverImagePath: form.coverImagePath || null,
      status,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
    };

    const response = await fetch(post ? `/api/blog/${post.id}` : "/api/blog", {
      method: post ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setMessage(data.error ?? "Unable to save");
      return;
    }
    setForm((current) => ({ ...current, status, slug: data.post.slug }));
    setMessage(status === "published" ? "Published." : "Draft saved.");
    if (!post && data.post?.id) {
      router.replace(`/admin/blog/${data.post.id}`);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await save("draft");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Title">
        <input
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;
            setForm((current) => ({
              ...current,
              title,
              slug: slugEdited.current ? current.slug : slugify(title),
            }));
          }}
          required
          className={inputClassName}
        />
      </FormField>
      <FormField label="Slug" hint="Used in /blog/your-slug">
        <input
          value={form.slug}
          onChange={(e) => {
            slugEdited.current = true;
            setForm({ ...form, slug: e.target.value });
          }}
          required
          className={inputClassName}
        />
      </FormField>
      <FormField label="Excerpt" hint="Shown on the blog index and in search results.">
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={3}
          className={textareaClassName}
        />
      </FormField>

      <div>
        <p className="mb-2 text-sm font-medium text-stone-200">Cover image</p>
        {form.coverImagePath ? (
          <img
            src={`/api/files/blog/${form.coverImagePath}`}
            alt=""
            className="mb-3 h-40 w-full max-w-md rounded-md object-cover"
          />
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => coverInput.current?.click()}>
            {form.coverImagePath ? "Replace cover" : "Upload cover"}
          </Button>
          {form.coverImagePath ? (
            <Button type="button" variant="ghost" onClick={() => setForm({ ...form, coverImagePath: "" })}>
              Remove cover
            </Button>
          ) : null}
        </div>
        <input ref={coverInput} type="file" accept="image/*" hidden onChange={handleCover} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-stone-200">Body</p>
        <div className="overflow-hidden rounded-md border border-stone-700 bg-black">
          <div className="flex flex-wrap gap-1 border-b border-stone-800 p-2">
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor?.isActive("heading", { level: 2 })}
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor?.isActive("heading", { level: 3 })}
            >
              H3
            </ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")}>
              Bold
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              active={editor?.isActive("italic")}
            >
              Italic
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              active={editor?.isActive("underline")}
            >
              Underline
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              active={editor?.isActive("bulletList")}
            >
              List
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              active={editor?.isActive("orderedList")}
            >
              Numbered
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              active={editor?.isActive("blockquote")}
            >
              Quote
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                const href = window.prompt("Link URL");
                if (!href) {
                  editor?.chain().focus().unsetLink().run();
                  return;
                }
                editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
              }}
              active={editor?.isActive("link")}
            >
              Link
            </ToolbarButton>
            <ToolbarButton onClick={() => fileInput.current?.click()}>Image</ToolbarButton>
            <ToolbarButton
              onClick={() => {
                const src = window.prompt("Paste a YouTube link");
                if (!src?.trim() || !editor) return;
                const inserted = editor.chain().focus().setYoutubeVideo({ src: src.trim() }).run();
                if (!inserted) {
                  setMessage("Use a youtube.com or youtu.be link.");
                }
              }}
            >
              YouTube
            </ToolbarButton>
          </div>
          <EditorContent editor={editor} />
        </div>
        <p className="mt-2 text-xs text-stone-500">
          YouTube: click YouTube and paste a watch URL, or paste the URL straight into the body.
        </p>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={handleInlineImage} />
      </div>

      <FormField label="SEO title" hint="Optional. Defaults to the post title.">
        <input
          value={form.seoTitle}
          onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
          className={inputClassName}
        />
      </FormField>
      <FormField label="SEO description">
        <textarea
          value={form.seoDescription}
          onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
          rows={2}
          className={textareaClassName}
        />
      </FormField>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save draft"}
        </Button>
        <Button type="button" disabled={saving} onClick={() => save("published")}>
          Publish
        </Button>
        {post?.status === "published" ? (
          <Button type="button" variant="secondary" disabled={saving} onClick={() => save("draft")}>
            Unpublish
          </Button>
        ) : null}
      </div>
      {message ? <p className="text-sm text-copper-light">{message}</p> : null}
    </form>
  );
}
