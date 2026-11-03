/** Normaliza texto para pesquisas insensíveis a maiúsculas e acentos. */
export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt')
    .trim();
}

/**
 * Divide a pesquisa em termos e exige que todos eles existam nos campos indicados.
 * Permite procurar por várias palavras ("vigilia oracao") e ignora acentos e maiúsculas.
 */
export function matchesSearchTerms(
  values: Array<string | undefined | null>,
  query: string
): boolean {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = normalizeSearch(values.filter((value): value is string => Boolean(value)).join(' '));
  return terms.every((term) => haystack.includes(term));
}
