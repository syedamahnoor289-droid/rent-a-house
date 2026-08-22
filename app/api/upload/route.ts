import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("images");

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: jpg, png, webp` },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${file.name}. Max 5MB` },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const uniqueName = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);
    urls.push(`/uploads/${uniqueName}`);
  }

  return NextResponse.json({ urls });
}
