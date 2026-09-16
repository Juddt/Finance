import { NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/session";
import { getProfile, updateProfile } from "@/lib/store";

export async function GET() {
  const userId = await getOrCreateUserId();
  const profile = await getProfile(userId);
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const userId = await getOrCreateUserId();
  const body = await request.json().catch(() => ({}));
  const patch: { locale?: "fr" | "en"; timezone?: string; dailyMinutes?: number } = {};
  if (body.locale === "fr" || body.locale === "en") patch.locale = body.locale;
  if (typeof body.timezone === "string") patch.timezone = body.timezone;
  if (typeof body.dailyMinutes === "number" && body.dailyMinutes > 0) patch.dailyMinutes = body.dailyMinutes;

  const profile = await updateProfile(userId, patch);
  return NextResponse.json(profile);
}
