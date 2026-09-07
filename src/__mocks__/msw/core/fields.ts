import { JsonSource, type Source } from "@/__mocks__/msw/core/source"

export type Parser<T> = (value: string) => T

export type FieldKind =
  | 'scalar'
  | 'object'
  | 'array'

export abstract class Field<T> {
  declare private readonly __type: (value: T) => T

  abstract readonly kind: FieldKind

  abstract has(source: Source, path: string): boolean
  abstract parse(source: Source, path: string, displayPath?: string): T
  abstract missing(path: string): T
}

function required(path: string): never {
  throw new Error(`Required mock request value is missing: "${path || '<root>'}"`)
}

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
    } catch (error) {
      throw decorateError(displayPath, error)
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
    return source.kind === 'json'
      ? source.has(path)
      : source.keys().some((key) => key.startsWith(path === '' ? '' : `${path}.`))
  }

  parse(source: Source, path: string, displayPath = path): T {
    const value = source.get(path)

    if (source.kind === 'json') {
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`${displayPath || '<root>'}: expected object`)
      }
      return parseSchema(this.schema, new JsonSource(value), '', displayPath)
    }

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
    return this.item.kind === 'scalar' || source.kind === 'json'
      ? source.has(path)
      : source.getArrayIndices(path).length > 0
  }

  parse(source: Source, path: string, displayPath = path): T[] {
    if (source.kind === 'json') {
      const value = source.get(path)

      if (!Array.isArray(value)) {
        throw new Error(`${displayPath || '<root>'}: expected array`)
      }

      if (this.item.kind === 'scalar') {
        const item = this.item as ScalarField<T>
        return value.map((entry, index) => item.parseValue(entry, `${displayPath}[${index}]`))
      }

      const item = this.item as ObjectField<any>
      return value.map((entry, index) => item.parse(new JsonSource(entry), '', `${displayPath}[${index}]`))
    }

    if (this.item.kind === 'scalar') {
      const item = this.item as ScalarField<T>
      return source.getAll(path).map((value, index) => item.parseValue(value, `${displayPath}[${index}]`))
    }

    const item = this.item as ObjectField<any>
    return source.getArrayIndices(path).map((index) => item.parse(source, `${path}.${index}`, `${displayPath}[${index}]`))
  }

  missing(_path: string): T[] {
    return []
  }
}

/* -------------------------------------------------------------------------- */
/*                             Optional / Nullable                            */
/* -------------------------------------------------------------------------- */

class OptionalField<T> extends Field<T | undefined> {
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

class NullableField<T> extends Field<T | null> {
  readonly kind: FieldKind

  constructor(readonly inner: Field<T>) {
    super()
    this.kind = inner.kind
  }

  has(source: Source, path: string): boolean {
    return this.inner.has(source, path)
  }

  parse(source: Source, path: string, displayPath = path): T | null {
    return source.get(path) === null
      ? null
      : this.inner.parse(source, path, displayPath)
  }

  missing(_path: string): T | null {
    return null
  }
}

/* -------------------------------------------------------------------------- */
/*                                Primitives                                 */
/* -------------------------------------------------------------------------- */

export const string = new ScalarField<string>((value) => {
  if (typeof value !== 'string') {
    throw new Error('expected string')
  }
  return value
})

export const number = new ScalarField<number>((value) => {
  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      throw new Error('invalid number: NaN')
    }
    return value
  }

  if (typeof value !== 'string') {
    throw new Error('expected number or numeric string')
  }

  if (value === '') {
    throw new Error('invalid number: empty value')
  }

  const result = Number(value)

  if (Number.isNaN(result)) {
    throw new Error(`invalid number: "${value}"`)
  }

  return result
})

export const boolean = new ScalarField<boolean>((value) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  throw new Error(`invalid boolean: "${String(value)}"`)
})

/**
 * Parser custom basé sur une string.
 *
 * Exemple :
 *
 *   field(
 *     (value) => value as EActivityStatus
 *   )
 */
export function field<T>(parser: Parser<T>): ScalarField<T> {
  return new ScalarField<T>((value) => {
    if (typeof value !== 'string') {
      throw new Error('expected string')
    }
    return parser(value)
  })
}

/**
 * File attendu dans un FormData.
 */
export function file(): ScalarField<File> {
  return new ScalarField<File>((value) => {
    if (typeof File === 'undefined' || !(value instanceof File)) {
      throw new Error('expected File')
    }
    return value
  })
}

/* -------------------------------------------------------------------------- */
/*                                  Object                                    */
/* -------------------------------------------------------------------------- */

export function object<T extends object>(schema: Schema<T>): ObjectField<T> {
  return new ObjectField(schema)
}

/* -------------------------------------------------------------------------- */
/*                                   Array                                    */
/* -------------------------------------------------------------------------- */

export function array<T>(field: ScalarField<T>): ArrayField<T>

export function array<T extends object>(field: ObjectField<T>): ArrayField<T>

export function array(field: ScalarField<any> | ObjectField<any>): ArrayField<any> {
  return new ArrayField(field)
}

/* -------------------------------------------------------------------------- */
/*                             Optional / Nullable                            */
/* -------------------------------------------------------------------------- */

export function optional<T>(field: Field<T>): Field<T | undefined> {
  return new OptionalField(field)
}

export function nullable<T>(field: Field<T>): Field<T | null> {
  return new NullableField(field)
}

/* -------------------------------------------------------------------------- */
/*                                    Schema                                  */
/* -------------------------------------------------------------------------- */

export type Schema<T extends object> = {
  [K in keyof T]-?: Field<T[K]>
}

/* -------------------------------------------------------------------------- */
/*                              Parsing helpers                               */
/* -------------------------------------------------------------------------- */

export function parseField<T>(field: Field<T>, source: Source, path: string, displayPath = path): T {
  return field.has(source, path)
    ? field.parse(source, path, displayPath)
    : field.missing(displayPath)
}

export function parseSchema<T extends object>(schema: Schema<T>, source: Source, sourcePrefix: string, displayPrefix = sourcePrefix): T {
  const result = {} as T

  for (const key of Object.keys(schema) as Array<keyof T>) {
    const keyText = String(key)
    const sourcePath = sourcePrefix ? `${sourcePrefix}.${keyText}` : keyText
    const displayPath = displayPrefix ? `${displayPrefix}.${keyText}` : keyText

    result[key] = parseField(schema[key], source, sourcePath, displayPath) as T[typeof key]
  }

  return result
}
