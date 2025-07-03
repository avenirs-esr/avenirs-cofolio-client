/**
 * Formate une chaîne de caractères en remplaçant les textes entourés de double astérisques (`**`)
 * par des balises HTML `<span>` avec une classe `text-underline` pour les souligner.
 *
 * @example
 * ```ts
 * formatTextToUnderlineHtml('Ceci est un **texte souligné**.')
 * // Retourne : 'Ceci est un <span class="text-underline">texte souligné</span>.'
 * ```
 *
 * @param {string} text - Le texte brut contenant éventuellement des expressions entre `**` à transformer.
 * @returns {string} Le texte avec les parties soulignées encapsulées dans une balise `<span>`.
 */
export function formatTextToUnderlineHtml (text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<span class="text-underline">$1</span>')
}
