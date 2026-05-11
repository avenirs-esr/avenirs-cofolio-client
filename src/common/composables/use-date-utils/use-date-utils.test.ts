import { useDateUtils } from '@/common/composables/use-date-utils/use-date-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { subHours, subMinutes, subSeconds } from 'date-fns'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a use-date-utils composable', () => {
  let composableResult: ReturnType<typeof useDateUtils>

  beforeEach(() => {
    vi.clearAllMocks()
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

  BddTest().when('formatting last modified date', () => {
    BddTest().and('the date is today and modified more than 1 hour ago', () => {
      BddTest().then('it should return hours ago with date', () => {
        const twoHoursAgo = subHours(new Date(), 2)
        const formatted = composableResult.formatLastModified(twoHoursAgo.toISOString())
        const formattedDate = `${String(twoHoursAgo.getDate()).padStart(2, '0')}/${String(twoHoursAgo.getMonth() + 1).padStart(2, '0')}/${twoHoursAgo.getFullYear()}`

        expect(formatted).toContain('Il y a 2 heures')
        expect(formatted).toContain(formattedDate)
      })

      BddTest().then('it should use singular form for exactly 1 hour', () => {
        const oneHourAgo = subHours(new Date(), 1)
        const formatted = composableResult.formatLastModified(oneHourAgo.toISOString())

        expect(formatted).toContain('Il y a 1 heure')
      })
    })

    BddTest().and('the date is today and modified less than 1 hour ago but more than 1 minute ago', () => {
      BddTest().then('it should return minutes ago with date', () => {
        const thirtyMinutesAgo = subMinutes(new Date(), 30)
        const formatted = composableResult.formatLastModified(thirtyMinutesAgo.toISOString())
        const formattedDate = `${String(thirtyMinutesAgo.getDate()).padStart(2, '0')}/${String(thirtyMinutesAgo.getMonth() + 1).padStart(2, '0')}/${thirtyMinutesAgo.getFullYear()}`

        expect(formatted).toContain('Il y a 30 minutes')
        expect(formatted).toContain(formattedDate)
      })

      BddTest().then('it should use singular form for exactly 1 minute', () => {
        const oneMinuteAgo = subMinutes(new Date(), 1)
        const formatted = composableResult.formatLastModified(oneMinuteAgo.toISOString())

        expect(formatted).toContain('Il y a 1 minute')
      })
    })

    BddTest().and('the date is today and modified less than 1 minute ago', () => {
      BddTest().then('it should return "À l\'instant"', () => {
        const thirtySecondsAgo = subSeconds(new Date(), 30)
        const formatted = composableResult.formatLastModified(thirtySecondsAgo.toISOString())

        expect(formatted).toBe('À l\'instant')
      })
    })

    BddTest().and('the date is not today', () => {
      BddTest().then('it should use formatTranslatedDateTime', () => {
        const pastDate = '2024-01-15T14:30:00'
        const formatted = composableResult.formatLastModified(pastDate)

        expect(formatted).toContain('15')
        expect(formatted).toContain('janvier')
        expect(formatted).toContain('2024')
        expect(formatted).toContain('à')
      })
    })
  })
})
