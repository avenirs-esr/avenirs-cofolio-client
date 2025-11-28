import type { Edge } from '@vue-flow/core'

/**
 * Convert rem units to pixels according to the root font size.
 * @param rem The value in rem units (string with 'rem' suffix or number).
 * @returns The equivalent value in pixels.
 */
export function remToPx (rem: string | number) {
  if (typeof rem === 'number') {
    return rem * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  }

  if (typeof rem === 'string' && rem.endsWith('rem')) {
    const remValue = Number.parseFloat(rem)

    if (Number.isNaN(remValue)) {
      return 0
    }

    const fontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    return remValue * fontSize
  }
  return 0
}

/**
 * Generate a unique edge ID based on its source, target, and their respective handles.
 * @param edge Edge object without an ID.
 * @returns A unique string ID for the edge.
 */
export function getEdgeId (edge: Omit<Edge, 'id'>) {
  return `e${edge.source}:${edge.sourceHandle}->${edge.target}:${edge.targetHandle}`
}
