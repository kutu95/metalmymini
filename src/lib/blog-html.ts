import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "h2",
  "h3",
  "h4",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "img",
  "hr",
  "code",
  "pre",
  "span",
  "div",
  "iframe",
];

const ALLOWED_ATTR = [
  "href",
  "src",
  "alt",
  "title",
  "target",
  "rel",
  "class",
  "width",
  "height",
  "allow",
  "allowfullscreen",
  "frameborder",
  "referrerpolicy",
  "loading",
  "data-youtube-video",
];

const YOUTUBE_EMBED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]);

export function isYouTubeEmbedSrc(src: string) {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;
    if (!YOUTUBE_EMBED_HOSTS.has(url.hostname)) return false;
    return url.pathname.startsWith("/embed/") && url.pathname.length > "/embed/".length;
  } catch {
    return false;
  }
}

let youtubeHookBound = false;

function bindYoutubeSanitizeHook() {
  if (youtubeHookBound) return;
  youtubeHookBound = true;
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName !== "iframe") return;
    const element = node as unknown as Element;
    const src = typeof element.getAttribute === "function" ? (element.getAttribute("src") ?? "") : "";
    if (!isYouTubeEmbedSrc(src) && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
}

export function sanitizeBlogHtml(html: string) {
  bindYoutubeSanitizeHook();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["target", "allowfullscreen"],
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "post";
}

export function blogImageUrl(filename: string) {
  return `/api/files/blog/${filename}`;
}
