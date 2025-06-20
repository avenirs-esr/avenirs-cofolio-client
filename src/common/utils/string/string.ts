export function formatTextToUnderlineHtml (text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<span class="text-underline">$1</span>')
}
