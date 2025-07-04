/**
 * Removes duplicates from an array and returns a new array containing only unique elements.
 *
 * @template T - The type of the elements in the array.
 * @param {T[]} array - The array that can contain duplicates.
 * @returns {T[]} A new array containing only the unique elements of the original array, in the order they appear.
 */
export function removeDuplicates<T> (array: T[]): T[] {
  return [...new Set(array)]
}
