import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { getSessionItems } from "@/lib/store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "no_session" }, { status: 401 });

  try {
    const items = await getSessionItems(userId, id);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 404 });
  }
}
