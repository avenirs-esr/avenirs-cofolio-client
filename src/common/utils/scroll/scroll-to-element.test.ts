import { scrollToElement } from '@/common/utils/scroll/scroll-to-element'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { vi } from 'vitest'

BddTest().given('scrollToElement function', () => {
  BddTest().when('called with an existing element id', () => {
    BddTest().then('it should scroll to the element', () => {
      const el = document.createElement('div')
      el.id = 'TITLE'
      el.scrollIntoView = vi.fn()
      document.body.appendChild(el)

      scrollToElement('TITLE')

      expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
      document.body.removeChild(el)
    })
  })

  BddTest().when('called with a non existing element id', () => {
    BddTest().then('it should not throw', () => {
      expect(() => scrollToElement('NON_EXISTING')).not.toThrow()
    })
  })
})
