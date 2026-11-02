import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { isEnumMember } from '@/common/utils/type-guards/type-guards'

enum EColor {
  RED = 'red',
  BLUE = 'blue'
}

BddTest().given('an isEnumMember checker with a string enum', () => {
  BddTest().when('the value is one of the enum values', () => {
    BddTest().then('it should return true', () => {
      expect(isEnumMember(EColor, 'red')).toBe(true)
      expect(isEnumMember(EColor, 'blue')).toBe(true)
    })
  })

  BddTest().when('the value is an enum key but not an enum value', () => {
    BddTest().then('it should return false', () => {
      expect(isEnumMember(EColor, 'RED')).toBe(false)
    })
  })

  BddTest().when('the value differs only by case', () => {
    BddTest().then('it should return false', () => {
      expect(isEnumMember(EColor, 'Red')).toBe(false)
    })
  })

  BddTest().when('the value is not in the enum', () => {
    BddTest().then('it should return false', () => {
      expect(isEnumMember(EColor, 'green')).toBe(false)
      expect(isEnumMember(EColor, '')).toBe(false)
    })
  })

  BddTest().when('the enum is empty', () => {
    BddTest().then('it should return false', () => {
      expect(isEnumMember({}, 'red')).toBe(false)
    })
  })

  BddTest().when('the value matches', () => {
    BddTest().then('it should narrow the value type', () => {
      const value: string = 'blue'
      if (isEnumMember(EColor, value)) {
        expectTypeOf(value).toEqualTypeOf<EColor>()
      }
      expect(isEnumMember(EColor, value)).toBe(true)
    })
  })
})
