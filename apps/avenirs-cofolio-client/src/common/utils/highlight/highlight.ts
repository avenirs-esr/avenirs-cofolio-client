export function highlightMatchedText (text: string, query: string, className: string): string {
  if (!query || query.trim().length === 0) {
    return text
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, `<span class="${className} highlight">$1</span>`)
}

export function highlightTitleText (text: string, query: string): string {
  return highlightMatchedText(text, query, 'b1-bold')
}

export function highlightCaptionText (text: string, query: string): string {
  return highlightMatchedText(text, query, 'caption-light')
}
