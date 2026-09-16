import { NextRequest, NextResponse } from "next/server";
import { getConceptById } from "@/content/catalog";
import { lessonsByConceptId, templatesByConceptId } from "@/lib/content-registry";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "fr";

  const concept = getConceptById(id);
  const lesson = lessonsByConceptId[id];
  if (!concept || !lesson || concept.status !== "published") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Métadonnées seules : les questions elles-mêmes sont générées à la volée par
  // /api/study-sessions (templates à variantes, voir lib/question-templates.ts).
  const questionTemplates = (templatesByConceptId[id] ?? []).map((t) => ({ id: t.id, kind: t.kind, difficulty: t.difficulty }));

  return NextResponse.json({
    conceptId: id,
    locale,
    title: concept.title[locale],
    objective: concept.objective[locale],
    estimatedMinutes: concept.estimatedMinutes,
    level: concept.level,
    sections: {
      intuition: lesson.intuition[locale],
      definition: lesson.definition[locale],
      utility: lesson.utility[locale],
      example: lesson.example[locale],
      calculation: lesson.calculation[locale],
      interpretation: lesson.interpretation[locale],
      pitfalls: lesson.pitfalls[locale],
      keyPoints: lesson.keyPoints[locale],
      advancedDemonstration: lesson.advancedDemonstration[locale],
    },
    formula: {
      latex: lesson.formula.latex,
      variables: lesson.formula.variables.map((v) => ({ symbol: v.symbol, description: v.description[locale] })),
      assumptions: lesson.formula.assumptions[locale],
      units: lesson.formula.units[locale],
      example: lesson.formula.example[locale],
    },
    questionTemplates,
  });
}
