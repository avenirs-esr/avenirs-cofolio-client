import { isValidEmail } from '@/ui/utils/forms/forms'
import { describe, expect, it } from 'vitest'

describe('isValidEmail', () => {
  describe('given a valid email address', () => {
    describe('when providing a standard email', () => {
      it('then it should return true', () => {
        expect(isValidEmail('john.doe@example.com')).toBe(true)
      })
    })

    describe('when providing a minimal valid email', () => {
      it('then it should return true', () => {
        expect(isValidEmail('a@b.co')).toBe(true)
      })
    })
  })

  describe('given an invalid email address', () => {
    describe('when providing a string without "@"', () => {
      it('then it should return false', () => {
        expect(isValidEmail('john.doe.example.com')).toBe(false)
      })
    })

    describe('when providing a string without domain', () => {
      it('then it should return false', () => {
        expect(isValidEmail('john.doe@')).toBe(false)
      })
    })

    describe('when providing a string without username', () => {
      it('then it should return false', () => {
        expect(isValidEmail('@example.com')).toBe(false)
      })
    })

    describe('when providing a string with multiple @ characters', () => {
      it('then it should return false', () => {
        expect(isValidEmail('john@@example.com')).toBe(false)
      })
    })

    describe('when providing a domain starting with a dot', () => {
      it('then it should return false', () => {
        expect(isValidEmail('john@.example.com')).toBe(false)
      })
    })

    describe('when providing a domain without dot', () => {
      it('then it should return false', () => {
        expect(isValidEmail('john@example')).toBe(false)
      })
    })

    describe('when providing a string with spaces', () => {
      it('then it should return false', () => {
        expect(isValidEmail('john doe@example.com')).toBe(false)
        expect(isValidEmail('john@ example.com')).toBe(false)
      })
    })

    describe('when providing an empty string', () => {
      it('then it should return false', () => {
        expect(isValidEmail('')).toBe(false)
      })
    })
  })
})
