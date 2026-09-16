// Point d'entrée unique et swappable utilisé par la page notion, pour que le
// choix serveur/statique se fasse par fichier (voir scripts/build-static.mjs)
// et non par un import conditionnel dans un Server Component : un import
// conditionnel laisserait les DEUX variantes (et donc les solutions de
// StaticQuizRunner) réunies dans le même chunk client, y compris dans le
// build normal. Ne pas éditer ce fichier à la main pendant un build:pages —
// il est remplacé puis restauré automatiquement.
export { QuizRunner as QuizSlot } from "./QuizRunner";
