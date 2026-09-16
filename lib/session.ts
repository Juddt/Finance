import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "fa_uid";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Identité minimale du MVP : un cookie httpOnly opaque tient lieu d'utilisateur,
 * en attendant Supabase Auth (voir README). Ne peut être appelé que depuis une
 * route handler ou une server action (cookies() y est accessible en écriture).
 */
export async function getOrCreateUserId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const id = randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
  });
  return id;
}

/** Lecture seule (Server Components) : ne crée jamais de cookie. */
export async function getUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}
