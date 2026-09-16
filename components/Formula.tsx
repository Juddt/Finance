import { renderKatex } from "@/lib/render-katex";

export function Formula({ latex, inline = false }: { latex: string; inline?: boolean }) {
  const html = renderKatex(latex, !inline);
  return (
    <span
      className={inline ? "" : "block overflow-x-auto py-1"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
