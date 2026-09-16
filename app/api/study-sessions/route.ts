import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/session";
import { createStudySession } from "@/lib/store";
import type { SessionLength, SessionSpec } from "@/lib/session-spec";

function parseLength(raw: unknown): SessionLength {
  if (raw === "continuous") return "continuous";
  if (raw === 5 || raw === 10 || raw === 20) return raw;
  throw new RangeError("Invalid session length");
}

function parseSpec(body: unknown): SessionSpec {
  if (typeof body !== "object" || body === null || !("spec" in body)) {
    throw new RangeError("Missing spec");
  }
  const spec = (body as { spec: unknown }).spec;
  if (typeof spec !== "object" || spec === null || !("mode" in spec)) {
    throw new RangeError("Invalid spec");
  }
  const s = spec as Record<string, unknown>;
  switch (s.mode) {
    case "concept":
      if (!Array.isArray(s.conceptIds) || s.conceptIds.length === 0) throw new RangeError("Missing conceptIds");
      return { mode: "concept", conceptIds: s.conceptIds as string[] };
    case "custom":
      if (!Array.isArray(s.conceptIds) || s.conceptIds.length === 0) throw new RangeError("Missing conceptIds");
      return { mode: "custom", conceptIds: s.conceptIds as string[], length: parseLength(s.length) };
    case "chapter":
      if (typeof s.chapterId !== "string") throw new RangeError("Missing chapterId");
      return { mode: "chapter", chapterId: s.chapterId, length: parseLength(s.length) };
    case "category":
      if (typeof s.categoryId !== "string") throw new RangeError("Missing categoryId");
      return { mode: "category", categoryId: s.categoryId, length: parseLength(s.length) };
    case "review-mistakes":
      return { mode: "review-mistakes", length: parseLength(s.length) };
    default:
      throw new RangeError("Unknown mode");
  }
}

export async function POST(request: NextRequest) {
  const userId = await getOrCreateUserId();
  const body = await request.json().catch(() => null);
  const locale = (body as { locale?: string } | null)?.locale === "en" ? "en" : "fr";

  let spec: SessionSpec;
  try {
    spec = parseSpec(body);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  try {
    const result = await createStudySession(userId, locale, spec);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
