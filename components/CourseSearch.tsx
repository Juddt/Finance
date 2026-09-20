"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { concepts, chapters } from "@/content/catalog";
import type { Locale } from "@/i18n/config";

export interface CourseSearchDict {
  searchPlaceholder: string;
  searchNoResults: string;
  searchResultsLabel: string;
}

const MAX_RESULTS = 8;

/**
 * Recherche client-side par titre (FR/EN, insensible à la casse) sur les
 * notions publiées — pas d'index externe, le catalogue tient en mémoire.
 * Voir demande section 4 : "accéder directement à une notion".
 */
export function CourseSearch({ locale, dict, className = "" }: { locale: Locale; dict: CourseSearchDict; className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return concepts
      .filter((c) => c.status === "published")
      .filter((c) => c.title.fr.toLowerCase().includes(q) || c.title.en.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS)
      .map((c) => {
        const chapter = chapters.find((ch) => ch.id === c.chapterId);
        return { concept: c, chapterTitle: chapter?.title[locale] ?? "" };
      });
  }, [query, locale]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const target = results[activeIndex];
      if (target) {
        window.location.href = `/${locale}/lessons/${target.concept.id}`;
      }
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={dict.searchPlaceholder}
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listboxId}
        aria-autocomplete="list"
        className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none"
      />
      {open && query.trim().length >= 2 && (
        <div id={listboxId} role="listbox" className="absolute top-[calc(100%+6px)] left-0 z-30 w-full min-w-[280px] rounded-xl border border-line bg-surface-2 p-1.5 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.6)]">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-text-faint">{dict.searchNoResults}</p>
          ) : (
            <ul>
              {results.map(({ concept, chapterTitle }, i) => (
                <li key={concept.id}>
                  <Link
                    href={`/${locale}/lessons/${concept.id}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm ${i === activeIndex ? "bg-surface text-text" : "text-text-dim hover:bg-surface hover:text-text"}`}
                  >
                    <span className="block truncate font-medium">{concept.title[locale]}</span>
                    <span className="block truncate text-xs text-text-faint">{chapterTitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
