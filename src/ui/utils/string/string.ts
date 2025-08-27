/**
 * Formats a string by applying structured HTML transformations based on specific patterns:
 *
 * - Text between `**...**` is underlined using a `<span class="text-underline">`.
 * - Text between `##...##` is colored and bold using a `<strong style="color: ...">`.
 * - Text within `(-...)` is converted to `<li>` items with an indentation class.
 * - Line breaks (`\n`, `\r`, `\\n`, etc.) are converted to `<div class="line-break"></div>`
 *   for visual spacing (e.g., adjustable height via CSS).
 *
 * @example
 * ```ts
 * formatTextToHtml('(-##Important## and **underlined**)\nNext line')
 * // Returns:
 * // '<li class="indented-list"><strong style="color: var(--dark-background-primary1)">Important</strong> and <span class="text-underline">underlined</span></li><div class="line-break"></div>Next line'
 * ```
 *
 * @param {string} text - The raw input string that may contain styling markers like `**`, `##`, or `(-...)`.
 * @param {string} color - The color applied to text wrapped in `**` and '###'. Defaults to 'var(--dark-background-primary1)'.
 * @returns {string} A string of HTML with appropriate tags for styling and structure.
 */
export function formatTextToHtml (text: string, color: string = 'var(--dark-background-primary1)'): string {
  return text
    // Header custom ### ... ###
    .replace(/###(.+?)###/gs, `<h1 style="display:flex;flex-direction:row;justify-content:start;font-size:var(--font-size-n6);line-height:var(--line-height-n5);color:${color}">$1</h1>`)
    // Content custom @@ ... @@
    .replace(/@@([\s\S]+?)@@/g, `<div>$1</div>`)
    // List items: "- " at beginning of line
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    .replace(/^\s*--\s+(.*)$/gm, '<li class="indented-list">$1</li>')
    // Handle \n as line-breaks
    .replace(/(\r\n|\n|\r|\\n|\\r)/g, '<div class="line-break"></div>')
    // Underline with __
    .replace(/__(.+?)__/g, '<span class="text-underline">$1</span>')
    // Strong colorized with **
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color: ${color}">$1</strong>`)
}
