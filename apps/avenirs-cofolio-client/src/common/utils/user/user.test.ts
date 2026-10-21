import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'
import { toFullName } from '@/common/utils/user/user'

BddTest().given('a full name formatter', () => {
  BddTest().when('both first and last names are provided', () => {
    BddTest().then('it should capitalize the first letter of each name', () => {
      expect(toFullName('alice', 'dupont')).toBe('Alice Dupont')
    })

    BddTest().then('it should lowercase the remaining letters', () => {
      expect(toFullName('ALICE', 'DUPONT')).toBe('Alice Dupont')
    })

    BddTest().then('it should handle names that are already capitalized', () => {
      expect(toFullName('Alice', 'Dupont')).toBe('Alice Dupont')
    })
  })

  BddTest().when('the first name is undefined', () => {
    BddTest().then('it should return only the capitalized last name', () => {
      expect(toFullName(undefined, 'dupont')).toBe('Dupont')
    })
  })

  BddTest().when('the last name is undefined', () => {
    BddTest().then('it should return only the capitalized first name', () => {
      expect(toFullName('alice', undefined)).toBe('Alice')
    })
  })

  BddTest().when('both names are undefined', () => {
    BddTest().then('it should return an empty string', () => {
      expect(toFullName(undefined, undefined)).toBe('')
    })
  })

  BddTest().when('one or both names are empty', () => {
    BddTest().then('it should trim the leading space', () => {
      expect(toFullName('', 'dupont')).toBe('Dupont')
    })

    BddTest().then('it should trim the trailing space', () => {
      expect(toFullName('alice', '')).toBe('Alice')
    })

    BddTest().then('it should return an empty string when both names are empty', () => {
      expect(toFullName('', '')).toBe('')
    })
  })
})
