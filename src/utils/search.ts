/** Normaliza texto para pesquisas insensíveis a maiúsculas e acentos. */
export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt')
    .trim();
}
