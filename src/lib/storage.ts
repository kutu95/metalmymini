import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { ACCEPTED_FILE_TYPES } from "@/lib/constants";

const STORAGE_ROOT = process.env.STORAGE_PATH ?? `${process.cwd()}/storage`;

export function getStorageRoot() {
  return STORAGE_ROOT;
}

export function getUploadsDir() {
  return path.join(STORAGE_ROOT, "uploads");
}

export function getGalleryDir() {
  return path.join(STORAGE_ROOT, "gallery");
}

export async function ensureStorageDirs() {
  await mkdir(getUploadsDir(), { recursive: true });
  await mkdir(getGalleryDir(), { recursive: true });
}

export function getMaxUploadBytes() {
  const mb = Number(process.env.MAX_UPLOAD_SIZE_MB ?? "100");
  return mb * 1024 * 1024;
}

export function validateModelExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ACCEPTED_FILE_TYPES.includes(ext as (typeof ACCEPTED_FILE_TYPES)[number]);
}

export function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function saveModelFile(file: File) {
  if (!validateModelExtension(file.name)) {
    throw new Error("Invalid file type. Accepted: STL, OBJ, 3MF.");
  }

  if (file.size > getMaxUploadBytes()) {
    throw new Error(`File exceeds maximum size of ${process.env.MAX_UPLOAD_SIZE_MB ?? "100"} MB.`);
  }

  await ensureStorageDirs();

  const ext = path.extname(file.name).toLowerCase();
  const storedFilename = `${randomUUID()}${ext}`;
  const filePath = path.join(getUploadsDir(), storedFilename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return {
    originalFilename: file.name,
    storedFilename,
    fileType: ext.replace(".", ""),
    fileSize: file.size,
    filePath,
  };
}

export async function saveGalleryImage(file: File) {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.name).toLowerCase();
  if (!allowed.includes(ext)) {
    throw new Error("Gallery images must be JPG, PNG, or WebP.");
  }

  await ensureStorageDirs();

  const storedFilename = `${randomUUID()}${ext}`;
  const filePath = path.join(getGalleryDir(), storedFilename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { storedFilename, filePath };
}

export async function readStoredFile(relativePath: string) {
  const fullPath = path.join(STORAGE_ROOT, relativePath);
  if (!fullPath.startsWith(STORAGE_ROOT)) {
    throw new Error("Invalid file path");
  }
  return readFile(fullPath);
}

export function toRelativeStoragePath(absolutePath: string) {
  return path.relative(STORAGE_ROOT, absolutePath);
}
