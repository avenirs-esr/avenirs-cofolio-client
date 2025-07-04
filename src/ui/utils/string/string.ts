/**
 * Formats a string by replacing text enclosed in double asterisks (`**`)
 * with HTML `<span>` tags with a `text-underline` class to underline them.
 *
 * @example
 * ```ts
 * formatTextToUnderlineHtml('This is **underlined text**.')
 * // Returns: 'This is <span class="text-underline">underlined text</span>.'
 * ```
 *
 * @param {string} text - The raw text, possibly containing expressions between `**` to be transformed.
 * @returns {string} The text with the underlined parts encapsulated in a `<span>` tag.
 */
export function formatTextToUnderlineHtml (text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<span class="text-underline">$1</span>')
}
