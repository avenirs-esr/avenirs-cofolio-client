import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'
import { withRequiredMark } from '@/common/utils/string/string'

BddTest().given('withRequiredMark', () => {
  BddTest().when('it is called with a text only', () => {
    BddTest().then('it should append a non-breaking space and an asterisk', () => {
      expect(withRequiredMark('Label')).toBe('Label\u00A0*')
    })
  })

  BddTest().when('it is called with required set to true', () => {
    BddTest().then('it should append a non-breaking space and an asterisk', () => {
      expect(withRequiredMark('Label', true)).toBe('Label\u00A0*')
    })
  })

  BddTest().when('it is called with required set to false', () => {
    BddTest().then('it should return the text unchanged', () => {
      expect(withRequiredMark('Label', false)).toBe('Label')
    })
  })
})
