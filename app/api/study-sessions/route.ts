import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/session";
import { createStudySession } from "@/lib/store";

export async function POST(request: NextRequest) {
  const userId = await getOrCreateUserId();
  const body = await request.json().catch(() => ({}));
  const mode = body.mode === "training" || body.mode === "exam" ? body.mode : "course";
  const locale = body.locale === "en" ? "en" : "fr";
  const conceptIds: string[] | undefined = Array.isArray(body.conceptIds) ? body.conceptIds : undefined;

  try {
    const result = await createStudySession({ userId, mode, locale, conceptIds });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
