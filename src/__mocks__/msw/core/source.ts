export type SourceType =
  | 'flat'
  | 'json'

export interface Source {
  readonly kind: SourceType

  has(path: string): boolean
  get(path: string): unknown
  getAll(path: string): unknown[]
  keys(): string[]
  getArrayIndices(path: string): number[]
}

export class FlatSource implements Source {
  readonly kind = 'flat' as const

  constructor(
    private readonly values: ReadonlyMap<string, readonly unknown[]>,
    private readonly normalizeKey: (key: string) => string = (key) => key
  ) {}

  static fromParams(params: Record<string, string | readonly string[]>): FlatSource {
    const values = new Map<string, readonly unknown[]>()

    for (const [key, value] of Object.entries(params)) {
      values.set(key, Array.isArray(value) ? [...value] : [value])
    }

    return new FlatSource(values)
  }

  static fromSearchParams(params: URLSearchParams): FlatSource {
    const values = new Map<string, unknown[]>()

    for (const [key, value] of params.entries()) {
      const current = values.get(key)

      if (current) {
        current.push(value)
      } else {
        values.set(key, [value])
      }
    }

    return new FlatSource(values)
  }

  static fromHeaders(headers: Headers): FlatSource {
    const values = new Map<string, readonly unknown[]>()

    headers.forEach((value, key) => {
      values.set(key.toLowerCase(), [value])
    })

    return new FlatSource(values, (key) => key.toLowerCase())
  }

  static fromCookies(cookies: Record<string, string>): FlatSource {
    const values = new Map<string, readonly unknown[]>()

    for (const [key, value] of Object.entries(cookies)) {
      values.set(key, [value])
    }

    return new FlatSource(values)
  }

  static fromFormData(formData: FormData): FlatSource {
    const values = new Map<string, unknown[]>()

    for (const [key, value] of formData.entries()) {
      const current = values.get(key)

      if (current) {
        current.push(value)
      } else {
        values.set(key, [value])
      }
    }

    return new FlatSource(values)
  }

  private normalize(path: string): string {
    return this.normalizeKey(path)
  }

  has(path: string): boolean {
    return this.values.has(this.normalize(path))
  }

  get(path: string): unknown {
    return this.values.get(this.normalize(path))?.[0]
  }

  getAll(path: string): unknown[] {
    const values = this.values.get(this.normalize(path))
    return values ? [...values] : []
  }

  keys(): string[] {
    return [...this.values.keys()]
  }

  getArrayIndices(path: string): number[] {
    const prefix = `${path}.`
    const indices = new Set<number>()

    for (const key of this.values.keys()) {
      if (!key.startsWith(prefix)) {
        continue
      }

      const indexText = key
        .slice(prefix.length)
        .split('.', 1)[0]

      if (!/^\d+$/.test(indexText)) {
        continue
      }

      const index = Number(indexText)

      if (!Number.isSafeInteger(index)) {
        throw new Error(`Invalid array index "${indexText}" in "${path}"`)
      }

      indices.add(index)
    }

    const result = [...indices].sort((a, b) => a - b)

    for (let index = 0; index < result.length; index++) {
      if (result[index] !== index) {
        throw new Error(`Array "${path}" must use contiguous indices starting at 0`)
      }
    }

    return result
  }
}

export class JsonSource implements Source {
  readonly kind = 'json' as const

  constructor(private readonly value: unknown) {}

  has(path: string): boolean {
    return path === ''
      ? true
      : this.get(path) !== undefined
  }

  get(path: string): unknown {
    if (path === '') {
      return this.value
    }

    let current = this.value

    for (const part of path.split('.')) {
      if (current === null || typeof current !== 'object' || !(part in current)) {
        return undefined
      }
      current = (current as Record<string, unknown>)[part]
    }

    return current
  }

  getAll(path: string): unknown[] {
    const value = this.get(path)
    return Array.isArray(value)
      ? [...value]
      : []
  }

  keys(): string[] {
    return this.value === null || typeof this.value !== 'object'
      ? []
      : Object.keys(this.value)
  }

  getArrayIndices(path: string): number[] {
    const value = this.get(path)
    return Array.isArray(value)
      ? value.map((_, index) => index)
      : []
  }
}
