import { useDateUtils } from '@/common/composables/use-date-utils/use-date-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'

BddTest().given('a use-date-utils composable', () => {
  let composableResult: ReturnType<typeof useDateUtils>

  beforeEach(() => {
    const result = mountComposable(() => useDateUtils(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('formatting a translated date time', () => {
    BddTest().then('it should format date with French locale', () => {
      const dateString = '2024-01-15T14:30:00'
      const formatted = composableResult.formatTranslatedDateTime(dateString)

      expect(formatted).toContain('15')
      expect(formatted).toContain('janvier')
      expect(formatted).toContain('2024')
      expect(formatted).toContain('à')
      expect(formatted).toMatch(/\d{2}:\d{2}/)
    })

    BddTest().then('it should format date correctly with different date', () => {
      const dateString = '2023-12-25T10:00:00'
      const formatted = composableResult.formatTranslatedDateTime(dateString)

      expect(formatted).toContain('25')
      expect(formatted).toContain('décembre')
      expect(formatted).toContain('2023')
      expect(formatted).toContain('à')
      expect(formatted).toMatch(/\d{2}:\d{2}/)
    })

    BddTest().then('it should include time separator', () => {
      const dateString = '2024-06-10T16:45:00'
      const formatted = composableResult.formatTranslatedDateTime(dateString)

      expect(formatted).toContain('à')
      expect(formatted).toContain('juin')
    })
  })
})
