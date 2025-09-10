import { isValidEmail } from '@/ui/utils/forms/forms'
import { BddTest } from 'tests/utils'
import { expect } from 'vitest'

BddTest().given('a valid email check', () => {
  BddTest().and('a valid email address', () => {
    BddTest().when('providing a standard email', () => {
      BddTest().then('it should return true', () => {
        expect(isValidEmail('john.doe@example.com')).toBe(true)
      })
    })

    BddTest().when('providing a minimal valid email', () => {
      BddTest().then('it should return true', () => {
        expect(isValidEmail('a@b.co')).toBe(true)
      })
    })
  })

  BddTest().and('an invalid email address', () => {
    BddTest().when('providing a string without "@"', () => {
      BddTest().then('it should return false', () => {
        expect(isValidEmail('john.doe.example.com')).toBe(false)
      })
    })

    BddTest().when('providing a string without domain', () => {
      BddTest().then('it should return false', () => {
        expect(isValidEmail('john.doe@')).toBe(false)
      })
    })

    BddTest().when('providing a string without username', () => {
      BddTest().then('it should return false', () => {
        expect(isValidEmail('@example.com')).toBe(false)
      })
    })

    BddTest().when('providing a string with multiple @ characters', () => {
      BddTest().then('it should return false', () => {
        expect(isValidEmail('john@@example.com')).toBe(false)
      })
    })

    BddTest().when('providing a domain starting with a dot', () => {
      BddTest().then('it should return false', () => {
        expect(isValidEmail('john@.example.com')).toBe(false)
      })
    })

    BddTest().when('providing a domain without dot', () => {
      BddTest().then('it should return false', () => {
        expect(isValidEmail('john@example')).toBe(false)
      })
    })

    BddTest().when('providing a string with spaces', () => {
      BddTest().then('it should return false', () => {
        expect(isValidEmail('john doe@example.com')).toBe(false)
        expect(isValidEmail('john@ example.com')).toBe(false)
      })
    })

    BddTest().when('providing an empty string', () => {
      BddTest().then('it should return false', () => {
        expect(isValidEmail('')).toBe(false)
      })
    })
  })
})
