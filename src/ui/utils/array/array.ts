/**
 * Supprime les doublons dans un tableau et retourne un nouveau tableau contenant uniquement des éléments uniques.
 *
 * @template T - Le type des éléments dans le tableau.
 * @param {T[]} array - Le tableau pouvant contenir des doublons.
 * @returns {T[]} Un nouveau tableau contenant uniquement les éléments uniques du tableau d'origine, dans leur ordre d'apparition.
 */
export function removeDuplicates<T> (array: T[]): T[] {
  return [...new Set(array)]
}
