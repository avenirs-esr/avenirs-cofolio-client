import { JsonSource, type Source } from './source'

export type FieldKind = 'scalar' | 'object' | 'array'

export abstract class Field<T> {
  abstract readonly kind: FieldKind
  abstract has(source: Source, path: string): boolean
  abstract parse(source: Source, path: string, displayPath?: string): T
  abstract missing(path: string): T
}

/** Throws when a required field is missing. */
function required(path: string): never {
  throw new Error(`Required mock request value is missing: "${path || '<root>'}"`)
}

/** Decorates parser errors with the displayPath. */
function decorateError(path: string, error: unknown): Error {
  if (error instanceof Error && error.message.startsWith(`${path}:`)) {
    return error
  }
  const message = error instanceof Error ? error.message : String(error)
  return new Error(`${path || '<root>'}: ${message}`)
}

export class ScalarField<T> extends Field<T> {
  readonly kind = 'scalar' as const

  constructor(readonly parser: (value: unknown) => T) {
    super()
  }

  has(source: Source, path: string): boolean {
    return source.has(path)
  }

  parse(source: Source, path: string, displayPath = path): T {
    const value = source.get(path)
    return value === undefined
      ? this.missing(displayPath)
      : this.parseValue(value, displayPath)
  }

  parseValue(value: unknown, displayPath: string): T {
    try {
      return this.parser(value)
    } catch (err) {
      throw decorateError(displayPath, err)
    }
  }

  missing(path: string): T {
    return required(path)
  }
}

export class ObjectField<T extends object> extends Field<T> {
  readonly kind = 'object' as const

  constructor(readonly schema: Schema<T>) {
    super()
  }

  has(source: Source, path: string): boolean {
    if (source.kind === 'json') {
      // If JSON, just check existence (null counts as present)
      return source.has(path)
    }
    // For flat source, any key starting with "path." indicates an object presence
    const prefix = path === '' ? '' : `${path}.`
    return source.keys().some((key) => key.startsWith(prefix))
  }

  parse(source: Source, path: string, displayPath = path): T {
    if (source.kind === 'json') {
      const value = source.get(path)
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`${displayPath || '<root>'}: expected object`)
      }
      // Parse nested JSON object
      return parseSchema(this.schema, new JsonSource(value), '', displayPath)
    }
    // Flat source: parse each field with prefix
    return parseSchema(this.schema, source, path, displayPath)
  }

  missing(path: string): T {
    return required(path)
  }
}

export class ArrayField<T> extends Field<T[]> {
  readonly kind = 'array' as const

  constructor(readonly item: ScalarField<T> | ObjectField<any>) {
    super()
  }

  has(source: Source, path: string): boolean {
    if (this.item.kind === 'scalar' || source.kind === 'json') {
      // Scalar arrays or JSON arrays: just check existence of path
      return source.has(path)
    }
    // Object arrays in flat source: check if any indices present
    return source.getArrayIndices(path).length > 0
  }

  parse(source: Source, path: string, displayPath = path): T[] {
    if (source.kind === 'json') {
      const value = source.get(path)
      if (!Array.isArray(value)) {
        throw new Error(`${displayPath || '<root>'}: expected array`)
      }
      if (this.item.kind === 'scalar') {
        // Scalar items: apply parser to each element
        return value.map((entry, i) =>
          (this.item as ScalarField<T>).parseValue(entry, `${displayPath}[${i}]`)
        )
      } else {
        // Object items: parse each entry with fresh JsonSource
        const subSchema = (this.item as ObjectField<any>).schema
        return (value as any[]).map((entry, i) => {
          return parseSchema(subSchema, new JsonSource(entry), '', `${displayPath}[${i}]`)
        })
      }
    }
    // Flat source
    if (this.item.kind === 'scalar') {
      const parser = this.item as ScalarField<T>
      return source.getAll(path).map((value, i) =>
        parser.parseValue(value, `${displayPath}[${i}]`)
      )
    } else {
      const objectItem = this.item as ObjectField<any>
      return source.getArrayIndices(path).map((i) => {
        return objectItem.parse(source, `${path}.${i}`, `${displayPath}[${i}]`)
      })
    }
  }

  missing(_path: string): T[] {
    return []
  }
}

/** Field that may be absent. Returns `undefined` instead of throwing if missing. */
export class OptionalField<T> extends Field<T | undefined> {
  readonly kind: FieldKind

  constructor(readonly inner: Field<T>) {
    super()
    this.kind = inner.kind
  }

  has(source: Source, path: string): boolean {
    return this.inner.has(source, path)
  }

  parse(source: Source, path: string, displayPath = path): T | undefined {
    return this.inner.parse(source, path, displayPath)
  }

  missing(_path: string): T | undefined {
    return undefined
  }
}

/** Field that may be `null` or a real value. */
export class NullableField<T> extends Field<T | null> {
  readonly kind: FieldKind

  constructor(readonly inner: Field<T>) {
    super()
    this.kind = inner.kind
  }

  has(source: Source, path: string): boolean {
    return this.inner.has(source, path)
  }

  parse(source: Source, path: string, displayPath = path): T | null {
    // If the JSON value is explicitly null, return null else parse normally
    return source.get(path) === null
      ? null
      : this.inner.parse(source, path, displayPath)
  }

  missing(_path: string): T | null {
    return null
  }
}

/* Primitives */
export const string = new ScalarField<string>((value) => {
  if (typeof value !== 'string') throw new Error('expected string')
  return value
})

export const number = new ScalarField<number>((value) => {
  if (typeof value === 'number') {
    if (Number.isNaN(value)) throw new Error('invalid number: NaN')
    return value
  }
  if (typeof value !== 'string') throw new Error('expected number or numeric string')
  if (value === '') throw new Error('invalid number: empty value')
  const result = Number(value)
  if (Number.isNaN(result)) throw new Error(`invalid number: "${value}"`)
  return result
})

export const boolean = new ScalarField<boolean>((value) => {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error(`invalid boolean: "${String(value)}"`)
})

/** Create a custom ScalarField from a string parser. */
export function field<T>(parser: (value: string) => T): ScalarField<T> {
  return new ScalarField<T>((value) => {
    if (typeof value !== 'string') throw new Error('expected string')
    return parser(value)
  })
}

/** Expects a `File` in FormData. */
export function file(): ScalarField<File> {
  return new ScalarField<File>((value) => {
    if (typeof File === 'undefined' || !(value instanceof File)) {
      throw new Error('expected File')
    }
    return value
  })
}

/** Create an ObjectField from a schema. */
export function object<T extends object>(schema: Schema<T>): ObjectField<T> {
  return new ObjectField(schema)
}

/** Create an ArrayField from a ScalarField or ObjectField. */
export function array<T>(field: ScalarField<T>): ArrayField<T>
export function array<T extends object>(field: ObjectField<T>): ArrayField<T>
export function array(field: ScalarField<any> | ObjectField<any>): ArrayField<any> {
  return new ArrayField(field)
}

/** Make a field optional (missing -> undefined). */
export function optional<T>(field: Field<T>): Field<T | undefined> {
  return new OptionalField(field)
}

/** Make a field nullable (missing -> null). */
export function nullable<T>(field: Field<T>): Field<T | null> {
  return new NullableField(field)
}

/** Schema type: maps keys of T to Field<T[K]> */
export type Schema<T extends object> = {
  [K in keyof T]-?: Field<T[K]>
}

/** Helper: parse a single field or throw. */
export function parseField<T>(
  field: Field<T>,
  source: Source,
  path: string,
  displayPath = path
): T {
  return field.has(source, path)
    ? field.parse(source, path, displayPath)
    : field.missing(displayPath)
}

/** Helper: parse an object given a schema. */
export function parseSchema<T extends object>(
  schema: Schema<T>,
  source: Source,
  sourcePrefix: string,
  displayPrefix = sourcePrefix
): T {
  const result = {} as T
  for (const key of Object.keys(schema) as Array<keyof T>) {
    const keyText = String(key)
    const sourcePath = sourcePrefix ? `${sourcePrefix}.${keyText}` : keyText
    const displayPath = displayPrefix ? `${displayPrefix}.${keyText}` : keyText
    result[key] = parseField(schema[key], source, sourcePath, displayPath) as T[typeof key]
  }
  return result
}
