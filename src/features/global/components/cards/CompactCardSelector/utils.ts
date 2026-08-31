export function getUnknownElementProp<T> (element: unknown, propName: string): T | undefined {
  if (
    element
    && typeof element === 'object'
    && propName in element
  ) {
    return (element as Record<string, unknown>)[propName] as T
  }
  return undefined
}
