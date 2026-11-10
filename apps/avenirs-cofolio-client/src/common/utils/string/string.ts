export function withRequiredMark (text: string, required = true) {
  return `${text}${required ? '\u00A0*' : ''}`
}
