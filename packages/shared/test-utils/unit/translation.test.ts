import { interpolateTranslation } from '#shared/test-utils/unit/translation'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'

BddTest().given('the translation interpolate test helper', () => {
  BddTest().when('the translation contains placeholders', () => {
    BddTest().then('it should replace each placeholder with its value', () => {
      expect(interpolateTranslation('{first} et {second}', { first: 'A', second: 'B' })).toBe('A et B')
    })

    BddTest().then('it should replace every occurrence of the same placeholder', () => {
      expect(interpolateTranslation('{title}, encore {title}', { title: 'A' })).toBe('A, encore A')
    })

    BddTest().then('it should insert values literally, including $ patterns', () => {
      expect(interpolateTranslation('"{title}"', { title: '$& $1' })).toBe('"$& $1"')
    })
  })

  BddTest().when('a placeholder has no value', () => {
    BddTest().then('it should leave it untouched', () => {
      expect(interpolateTranslation('Bonjour {name}', {})).toBe('Bonjour {name}')
    })
  })
})
