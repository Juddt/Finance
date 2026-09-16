import { NextRequest, NextResponse } from "next/server";
import { categories, chapters, concepts } from "@/content/catalog";
import { getCatalogStats } from "@/lib/store";
import { getUserId } from "@/lib/session";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "fr";
  const userId = await getUserId();
  const stats = await getCatalogStats(userId);
  const statsByCategory = new Map(stats.map((s) => [s.categoryId, s]));

  const body = {
    locale,
    categories: categories
      .sort((a, b) => a.position - b.position)
      .map((category) => {
        const categoryChapters = chapters
          .filter((ch) => ch.categoryId === category.id)
          .sort((a, b) => a.position - b.position)
          .map((chapter) => ({
            id: chapter.id,
            title: chapter.title[locale],
            summary: chapter.summary[locale],
            concepts: concepts
              .filter((c) => c.chapterId === chapter.id)
              .map((c) => ({
                id: c.id,
                title: c.title[locale],
                objective: c.objective[locale],
                level: c.level,
                estimatedMinutes: c.estimatedMinutes,
                status: c.status,
              })),
          }));
        const s = statsByCategory.get(category.id) ?? {
          totalConcepts: 0,
          publishedConcepts: 0,
          studiedConcepts: 0,
          masteredConcepts: 0,
        };
        return {
          id: category.id,
          slug: category.slug,
          icon: category.icon,
          color: category.color,
          title: category.title[locale],
          summary: category.summary[locale],
          level: category.level[locale],
          prerequisites: category.prerequisites[locale],
          stats: s,
          chapters: categoryChapters,
        };
      }),
  };

  return NextResponse.json(body);
}
