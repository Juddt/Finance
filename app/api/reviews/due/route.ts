import { NextResponse } from "next/server";
import { getConceptById } from "@/content/catalog";
import { getUserId } from "@/lib/session";
import { getDueReviews } from "@/lib/store";

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ due: [] });

  const locale = new URL(request.url).searchParams.get("locale") === "en" ? "en" : "fr";
  const due = await getDueReviews(userId, new Date());
  return NextResponse.json({
    due: due.map((d) => ({
      conceptId: d.conceptId,
      dueAt: d.dueAt,
      title: getConceptById(d.conceptId)?.title[locale] ?? d.conceptId,
    })),
  });
}
