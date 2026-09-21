/**
 * Générateur pseudo-aléatoire déterministe (mulberry32) : une même seed
 * produit toujours la même suite. Sert à générer des variantes de questions
 * reproductibles (utile pour les tests) et identiques entre client et
 * serveur (aucune dépendance Node-only, tourne aussi dans le navigateur pour
 * le build GitHub Pages).
 */
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seed non-déterministe, pour tirer une nouvelle variante à chaque génération. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export function randomInt(rng: Rng, min: number, max: number): number {
  if (max < min) throw new RangeError("max must be >= min");
  return min + Math.floor(rng() * (max - min + 1));
}

/** Nombre décimal dans [min, max], arrondi à `decimals` décimales. */
export function randomFloat(rng: Rng, min: number, max: number, decimals = 2): number {
  const value = min + rng() * (max - min);
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  if (items.length === 0) throw new RangeError("Cannot pick from an empty array");
  return items[randomInt(rng, 0, items.length - 1)];
}

/** Mélange Fisher-Yates déterministe (ne mute pas le tableau d'entrée). */
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(rng, 0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Garantit des valeurs numériques distinctes après arrondi, en décalant tout doublon d'un
 * pas fixe. Plusieurs formules de distracteurs (bon signe inversé, mauvaise unité...) peuvent
 * occasionnellement produire la même valeur arrondie selon les paramètres tirés — voir demande
 * "les 4 valeurs doivent rester distinctes après arrondi". Le premier élément (la bonne
 * réponse) n'est jamais décalé ; seuls les suivants le sont si besoin, dans l'ordre.
 */
export function distinctRounded(values: readonly number[], decimals: number, step: number): number[] {
  const factor = 10 ** decimals;
  const round = (v: number) => Math.round(v * factor) / factor;
  const seen = new Set<number>();
  return values.map((raw) => {
    let candidate = round(raw);
    while (seen.has(candidate)) candidate = round(candidate + step);
    seen.add(candidate);
    return candidate;
  });
}
