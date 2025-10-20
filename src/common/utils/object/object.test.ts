import { removeEmpty } from '@/common/utils/object/object'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a removeEmpty utility function', () => {
  let input: Record<string, any>
  let result: Record<string, any>

  BddTest().when('the object contains undefined, null, empty strings and empty arrays', () => {
    beforeEach(() => {
      input = {
        a: undefined,
        b: null,
        c: '',
        d: '   ',
        e: [],
        f: ['value'],
        g: 'non-empty',
        h: 0,
        i: false,
        j: {},
      }
      result = removeEmpty(input)
    })

    BddTest().then('it should remove undefined, null, empty strings and empty arrays', () => {
      expect(result).toEqual({
        f: ['value'],
        g: 'non-empty',
        h: 0,
        i: false,
        j: {},
      })
    })
  })

  BddTest().when('the object contains only empty values', () => {
    beforeEach(() => {
      input = {
        a: '',
        b: null,
        c: undefined,
        d: [],
      }
      result = removeEmpty(input)
    })

    BddTest().then('it should return an empty object', () => {
      expect(result).toEqual({})
    })
  })

  BddTest().when('the object is already clean', () => {
    beforeEach(() => {
      input = {
        name: 'Alice',
        age: 30,
        skills: ['vue', 'react'],
      }
      result = removeEmpty(input)
    })

    BddTest().then('it should return the same object content', () => {
      expect(result).toEqual({
        name: 'Alice',
        age: 30,
        skills: ['vue', 'react'],
      })
    })
  })

  BddTest().when('the object contains nested objects', () => {
    beforeEach(() => {
      input = {
        nested: {
          a: undefined,
          b: '',
          c: 'ok',
        },
        valid: 'yes',
      }
      result = removeEmpty(input)
    })

    BddTest().then('it should not filter nested object values recursively', () => {
      expect(result).toEqual({
        nested: {
          a: undefined,
          b: '',
          c: 'ok',
        },
        valid: 'yes',
      })
    })
  })
})
