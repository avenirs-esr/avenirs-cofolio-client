export function hasStringField<T extends string> (
  obj: unknown,
  field: T
): obj is Record<T, string> {
  return (
    typeof obj === 'object'
    && obj !== null
    && Object.prototype.hasOwnProperty.call(obj, field)
    && typeof (obj as Record<T, unknown>)[field] === 'string'
  )
}
