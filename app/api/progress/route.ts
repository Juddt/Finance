import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { getConceptProgressMap } from "@/lib/store";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ progress: {} });
  const progress = await getConceptProgressMap(userId);
  return NextResponse.json({ progress });
}
