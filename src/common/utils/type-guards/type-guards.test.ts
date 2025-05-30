import { hasStringField } from './type-guards'

describe('hasStringField', () => {
  it('returns true if the field exists and is a string', () => {
    const obj = { name: 'Alice' }
    expect(hasStringField(obj, 'name')).toBe(true)
  })

  it('returns false if the field does not exist', () => {
    const obj = { age: 30 }
    expect(hasStringField(obj, 'name')).toBe(false)
  })

  it('returns false if the field exists but is not a string', () => {
    const obj = { age: 30 }
    expect(hasStringField(obj, 'age')).toBe(false)
  })

  it('returns false if obj is null', () => {
    expect(hasStringField(null, 'name')).toBe(false)
  })

  it('returns false if obj is not an object', () => {
    expect(hasStringField(42, 'name')).toBe(false)
    expect(hasStringField('test', 'name')).toBe(false)
    expect(hasStringField(undefined, 'name')).toBe(false)
  })
})
