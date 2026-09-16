import { NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { getProfile, submitAttempt } from "@/lib/store";
import type { SubmittedAnswer } from "@/lib/question-types";

function parseAnswer(body: unknown): SubmittedAnswer {
  if (typeof body !== "object" || body === null || !("kind" in body)) {
    throw new RangeError("Missing answer.kind");
  }
  const answer = body as Record<string, unknown>;
  if (answer.kind === "mcq" || answer.kind === "true_false") {
    if (typeof answer.choiceId !== "string") throw new RangeError("Missing choiceId");
    return { kind: answer.kind, choiceId: answer.choiceId };
  }
  if (answer.kind === "numeric") {
    if (typeof answer.value !== "number" || !Number.isFinite(answer.value)) {
      throw new RangeError("Missing numeric value");
    }
    return { kind: "numeric", value: answer.value };
  }
  if (answer.kind === "fill_blank") {
    if (typeof answer.text !== "string") throw new RangeError("Missing text");
    return { kind: "fill_blank", text: answer.text };
  }
  throw new RangeError("Unsupported answer kind");
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await params;
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "no_session" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body.instanceId !== "string") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  let answer: SubmittedAnswer;
  try {
    answer = parseAnswer(body.answer);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  const durationMs = typeof body.durationMs === "number" && body.durationMs >= 0 ? body.durationMs : 0;
  const counted = body.counted !== false;
  const profile = await getProfile(userId);

  try {
    const result = await submitAttempt({
      userId,
      sessionId,
      instanceId: body.instanceId,
      answer,
      durationMs,
      counted,
      timezone: profile.timezone,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
