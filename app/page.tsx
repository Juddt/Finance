"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

/**
 * Filet pour le build GitHub Pages (export statique, sans proxy.ts). Dans le
 * build normal, proxy.ts redirige déjà "/" vers `/${defaultLocale}` en amont.
 */
export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${defaultLocale}`);
  }, [router]);

  return (
    <p style={{ padding: 24, fontFamily: "sans-serif" }}>
      Redirection… <Link href={`/${defaultLocale}`}>Continuer vers Finance Academy</Link>
    </p>
  );
}
