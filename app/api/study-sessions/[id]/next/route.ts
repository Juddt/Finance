import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { getNextQuestion } from "@/lib/store";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await params;
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "no_session" }, { status: 401 });

  try {
    const result = await getNextQuestion(userId, sessionId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
