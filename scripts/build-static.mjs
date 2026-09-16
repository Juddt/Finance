#!/usr/bin/env node
// Build d'export statique pour GitHub Pages.
//
// Next.js n'autorise pas les routes API dynamiques (POST) ni proxy.ts
// (middleware) avec `output: "export"` (cookies/proxy/route handlers
// dynamiques sont explicitement non supportés). On déplace donc ces fichiers
// hors du projet le temps du build, puis on les restaure systématiquement
// (y compris en cas d'échec) pour ne jamais casser le build normal
// (npm run dev / npm run build, cible Vercel/Node).
//
// components/QuizSlot.tsx est en plus remplacé par la variante statique
// (StaticQuizRunner, correction locale/localStorage) : un simple import
// conditionnel dans la page (au lieu d'un remplacement de fichier) ferait
// fusionner les deux variantes dans le même chunk client et enverrait les
// solutions des questions au navigateur même dans le build normal — vérifié
// empiriquement avant d'adopter cette approche.
import { execFileSync } from "node:child_process";
import { existsSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const quizSlotPath = path.join(root, "components", "QuizSlot.tsx");
const quizSlotBak = path.join(root, "components", "QuizSlot.tsx.static-build-bak");

const moves = [
  [path.join(root, "proxy.ts"), path.join(root, "proxy.ts.static-build-bak")],
  // Doit sortir entièrement de app/ : Next.js scanne tout dossier sous app/
  // comme des segments de route, même renommé (seuls "_x" et "(group)" sont
  // ignorés), donc un simple renommage sur place ne suffit pas.
  [path.join(root, "app", "api"), path.join(root, "api.static-build-bak")],
  [quizSlotPath, quizSlotBak],
];

function apply(pairs) {
  for (const [from, to] of pairs) {
    if (existsSync(from)) renameSync(from, to);
  }
}

function revert(pairs) {
  for (const [from, to] of pairs) {
    if (existsSync(to)) renameSync(to, from);
  }
}

apply(moves);
try {
  writeFileSync(
    quizSlotPath,
    '// Fichier généré temporairement par scripts/build-static.mjs — voir components/QuizSlot.tsx.static-build-bak\n' +
      'export { StaticQuizRunner as QuizSlot } from "./StaticQuizRunner";\n'
  );
  execFileSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });
} finally {
  if (existsSync(quizSlotPath)) rmSync(quizSlotPath);
  revert(moves);
}
