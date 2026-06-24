import { useDateUtils } from '@/common/composables/use-date-utils/use-date-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { subDays, subHours, subMinutes, subMonths, subSeconds, subWeeks, subYears } from 'date-fns'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const FIXED_NOW = new Date('2025-06-16T12:00:00.000Z')

BddTest().given('a use-date-utils composable', () => {
  let composableResult: ReturnType<typeof useDateUtils>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)

    const result = mountComposable(() => useDateUtils(), {
      useI18n: true
    })

    composableResult = result.result
  })

  afterEach(() => {
    vi.useRealTimers()
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

  BddTest().when('formatting last modified date in regular mode', () => {
    BddTest().and('the date is today and modified less than 1 minute ago', () => {
      BddTest().then('it should return "À l\'instant"', () => {
        const thirtySecondsAgo = subSeconds(FIXED_NOW, 30)
        const formatted = composableResult.formatLastModified(thirtySecondsAgo.toISOString())

        expect(formatted).toBe('À l\'instant')
      })
    })

    BddTest().and('the date is today and modified less than 1 hour ago but more than 1 minute ago', () => {
      BddTest().then('it should use singular form for exactly 1 minute', () => {
        const oneMinuteAgo = subMinutes(FIXED_NOW, 1)
        const formatted = composableResult.formatLastModified(oneMinuteAgo.toISOString())

        expect(formatted).toBe('Il y a 1 minute')
      })

      BddTest().then('it should return minutes ago', () => {
        const thirtyMinutesAgo = subMinutes(FIXED_NOW, 30)
        const formatted = composableResult.formatLastModified(thirtyMinutesAgo.toISOString())

        expect(formatted).toBe('Il y a 30 minutes')
      })
    })

    BddTest().and('the date is today and modified more than 1 hour ago', () => {
      BddTest().then('it should use singular form for exactly 1 hour', () => {
        const oneHourAgo = subHours(FIXED_NOW, 1)
        const formatted = composableResult.formatLastModified(oneHourAgo.toISOString())

        expect(formatted).toBe('Il y a 1 heure')
      })

      BddTest().then('it should return hours ago', () => {
        const twoHoursAgo = subHours(FIXED_NOW, 2)
        const formatted = composableResult.formatLastModified(twoHoursAgo.toISOString())

        expect(formatted).toBe('Il y a 2 heures')
      })
    })

    BddTest().and('the date is not today', () => {
      BddTest().then('it should return date in dd/MM/yyyy format', () => {
        const pastDate = '2024-01-15T14:30:00'
        const formatted = composableResult.formatLastModified(pastDate)

        expect(formatted).toBe('15/01/2024')
      })

      BddTest().then('it should also return date in dd/MM/yyyy format for yesterday', () => {
        const yesterday = subDays(FIXED_NOW, 1)
        const formatted = composableResult.formatLastModified(yesterday.toISOString())

        expect(formatted).toBe('15/06/2025')
      })
    })
  })

  BddTest().when('formatting last modified date in compact mode', () => {
    BddTest().and('the date is less than 1 minute ago', () => {
      BddTest().then('it should return just now', () => {
        const thirtySecondsAgo = subSeconds(FIXED_NOW, 30)
        const formatted = composableResult.formatLastModified(thirtySecondsAgo.toISOString(), true)

        expect(formatted).toBe('À l\'instant')
      })
    })

    BddTest().and('the date is today and modified less than 1 hour ago but more than 1 minute ago', () => {
      BddTest().then('it should return compact minutes', () => {
        const thirtyMinutesAgo = subMinutes(FIXED_NOW, 30)
        const formatted = composableResult.formatLastModified(thirtyMinutesAgo.toISOString(), true)

        expect(formatted).toBe('30 min')
      })
    })

    BddTest().and('the date is today and modified more than 1 hour ago', () => {
      BddTest().then('it should return compact hours', () => {
        const twoHoursAgo = subHours(FIXED_NOW, 2)
        const formatted = composableResult.formatLastModified(twoHoursAgo.toISOString(), true)

        expect(formatted).toBe('2 h')
      })
    })

    BddTest().and('the date is 3 days ago', () => {
      BddTest().then('it should return compact days', () => {
        const threeDaysAgo = subDays(FIXED_NOW, 3)
        const formatted = composableResult.formatLastModified(threeDaysAgo.toISOString(), true)

        expect(formatted).toBe('3 j')
      })
    })

    BddTest().and('the date is 2 weeks ago', () => {
      BddTest().then('it should return compact weeks', () => {
        const twoWeeksAgo = subWeeks(FIXED_NOW, 2)
        const formatted = composableResult.formatLastModified(twoWeeksAgo.toISOString(), true)

        expect(formatted).toBe('2 sem')
      })
    })

    BddTest().and('the date is 2 months ago', () => {
      BddTest().then('it should return compact months', () => {
        const twoMonthsAgo = subMonths(FIXED_NOW, 2)
        const formatted = composableResult.formatLastModified(twoMonthsAgo.toISOString(), true)

        expect(formatted).toBe('2 mois')
      })
    })

    BddTest().and('the date is 2 years ago', () => {
      BddTest().then('it should return compact years', () => {
        const twoYearsAgo = subYears(FIXED_NOW, 2)
        const formatted = composableResult.formatLastModified(twoYearsAgo.toISOString(), true)

        expect(formatted).toBe('2 ans')
      })
    })
  })

  BddTest().when('formatting last modified date with a Date object', () => {
    BddTest().then('it should accept a Date instance', () => {
      const dateObject = subHours(FIXED_NOW, 2)
      const formatted = composableResult.formatLastModified(dateObject, false)

      expect(formatted).toBe('Il y a 2 heures')
    })
  })
})
