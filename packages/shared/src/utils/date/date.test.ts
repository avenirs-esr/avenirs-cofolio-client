import {
  formatDateLocalized,
  formatDateToYearLocalized,
  formatDateToYearMonth,
  formatDateToYearMonthLocalized,
  formatTimeLocalized,
  formatYearMonthToDate,
  fromInstant,
  getCalendarDate,
  getDaysUntil,
  getLocalizedAbbrMonth,
  parseDate,
  toInstant,
} from '#shared/utils/date/date'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { format, parseISO } from 'date-fns'
import { expect } from 'vitest'

BddTest().given('a date parser', () => {
  BddTest().when('receiving a valid ISO date', () => {
    BddTest().then('it should parse supported ISO formats correctly', () => {
      const dates = [
        '2025-05-23T14:31:50.007Z',
        '2025-05-23T14:32:50Z',
        '2025-05-23T14:33:50',
        '2025-05-23T14:34',
        '2025-05-24',
      ]

      dates.forEach((date) => {
        expect(parseDate(date).getTime()).toBe(parseISO(date).getTime())
      })
    })
  })

  BddTest().when('receiving an ISO date with a timezone offset', () => {
    BddTest().then('it should preserve the represented instant', () => {
      const date = '2025-05-23T14:31:50+02:00'

      expect(parseDate(date).getTime()).toBe(parseISO(date).getTime())
    })
  })

  BddTest().when('receiving a date accepted by the native Date constructor', () => {
    BddTest().then('it should use the fallback parser', () => {
      const date = 'May 23, 2025 15:34:05 GMT+0200'

      expect(parseDate(date).getTime()).toBe(new Date(date).getTime())
    })
  })

  BddTest().when('receiving a timestamp', () => {
    BddTest().then('it should return a Date built from that timestamp', () => {
      const timestamp = 1737000000000

      expect(parseDate(timestamp).getTime()).toBe(timestamp)
    })
  })

  BddTest().when('receiving a Date object', () => {
    BddTest().then('it should return the same Date object', () => {
      const date = new Date('2025-05-23T14:31:50.007Z')

      expect(parseDate(date)).toBe(date)
    })
  })

  BddTest().when('receiving an invalid date string', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'not a date'

      expect(() => parseDate(date)).toThrow(`Invalid ISO date: ${date}`)
    })
  })
})

BddTest().given('a calendar date getter', () => {
  BddTest().when('providing any date', () => {
    BddTest().then('it should return the correct day number', () => {
      for (let i = 1; i <= 31; i++) {
        const day = String(i).padStart(2, '0')
        const date = `2025-07-${day}`

        expect(getCalendarDate(date)).toBe(i)
      }
    })
  })

  BddTest().when('providing a Date object', () => {
    BddTest().then('it should return the correct day number', () => {
      expect(getCalendarDate(new Date(2025, 4, 23))).toBe(23)
    })
  })

  BddTest().when('providing a timestamp', () => {
    BddTest().then('it should return the correct day number', () => {
      const date = new Date(2025, 4, 23)

      expect(getCalendarDate(date.getTime())).toBe(23)
    })
  })
})

BddTest().given('a days until getter', () => {
  BddTest().when('providing a future date', () => {
    BddTest().then('it should return the number of days until that date', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 30)

      expect(getDaysUntil(futureDate)).toBe(30)
    })
  })

  BddTest().when('providing today\'s date', () => {
    BddTest().then('it should return 0', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      expect(getDaysUntil(today)).toBe(0)
    })
  })

  BddTest().when('providing a past date', () => {
    BddTest().then('it should return a negative number of days', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const pastDate = new Date(today)
      pastDate.setDate(pastDate.getDate() - 10)

      expect(getDaysUntil(pastDate)).toBe(-10)
    })
  })

  BddTest().when('providing a date with a non-midnight time', () => {
    BddTest().then('it should ignore the time part', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 5)
      futureDate.setHours(23, 59, 59, 999)

      expect(getDaysUntil(futureDate)).toBe(5)
    })
  })

  BddTest().when('providing an ISO date string', () => {
    BddTest().then('it should return the correct number of days', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 7)

      expect(getDaysUntil(format(futureDate, 'yyyy-MM-dd'))).toBe(7)
    })
  })

  BddTest().when('providing a timestamp', () => {
    BddTest().then('it should return the correct number of days', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 7)

      expect(getDaysUntil(futureDate.getTime())).toBe(7)
    })
  })
})

BddTest().given('a localized date formatter', () => {
  BddTest().when('providing a date with time', () => {
    BddTest().then('it should format the date according to the locale', () => {
      const date = '2025-01-15T14:30:00'

      expect(formatDateLocalized(date, 'fr')).toBe('15 janvier 2025')
      expect(formatDateLocalized(date, 'en')).toBe('January 15, 2025')
    })
  })

  BddTest().when('providing a date without time', () => {
    BddTest().then('it should format the date correctly', () => {
      const date = '2025-12-25'

      expect(formatDateLocalized(date, 'fr')).toBe('25 décembre 2025')
      expect(formatDateLocalized(date, 'en')).toBe('December 25, 2025')
    })
  })

  BddTest().when('explicitly passing compact as false', () => {
    BddTest().then('it should use the full date format', () => {
      const date = '2025-03-08'

      expect(formatDateLocalized(date, 'fr', false)).toBe('8 mars 2025')
      expect(formatDateLocalized(date, 'en', false)).toBe('March 8, 2025')
    })
  })

  BddTest().when('passing compact as true', () => {
    BddTest().then('it should use the locale-specific numeric format', () => {
      const date = '2025-03-08'

      expect(formatDateLocalized(date, 'fr', true)).toBe('08/03/2025')
      expect(formatDateLocalized(date, 'en', true)).toBe('03/08/2025')
    })
  })

  BddTest().when('passing compact as true with single-digit day and month', () => {
    BddTest().then('it should pad day and month with a leading zero', () => {
      const date = '2025-01-05'

      expect(formatDateLocalized(date, 'fr', true)).toBe('05/01/2025')
      expect(formatDateLocalized(date, 'en', true)).toBe('01/05/2025')
    })
  })

  BddTest().when('providing a Date object', () => {
    BddTest().then('it should format the date correctly', () => {
      const date = new Date(2025, 4, 23)

      expect(formatDateLocalized(date, 'fr')).toBe('23 mai 2025')
      expect(formatDateLocalized(date, 'en')).toBe('May 23, 2025')
    })
  })

  BddTest().when('providing a timestamp', () => {
    BddTest().then('it should format the date correctly', () => {
      const date = new Date(2025, 4, 23).getTime()

      expect(formatDateLocalized(date, 'fr')).toBe('23 mai 2025')
      expect(formatDateLocalized(date, 'en')).toBe('May 23, 2025')
    })
  })
})

BddTest().given('a localized time formatter', () => {
  BddTest().when('providing a date with time', () => {
    BddTest().then('it should format the time according to the locale', () => {
      const date = '2025-01-15T14:30:45'

      expect(formatTimeLocalized(date, 'fr')).toBe('14:30')
      expect(formatTimeLocalized(date, 'en')).toBe('2:30 PM')
    })
  })

  BddTest().when('providing different times', () => {
    BddTest().then('it should format morning and evening times correctly', () => {
      expect(formatTimeLocalized('2025-01-15T09:05:00', 'fr')).toBe('09:05')
      expect(formatTimeLocalized('2025-01-15T23:55:00', 'fr')).toBe('23:55')
    })
  })

  BddTest().when('explicitly passing compact as false', () => {
    BddTest().then('it should use the locale-specific format', () => {
      const date = '2025-01-15T14:30:45'

      expect(formatTimeLocalized(date, 'fr', false)).toBe('14:30')
      expect(formatTimeLocalized(date, 'en', false)).toBe('2:30 PM')
    })
  })

  BddTest().when('passing compact as true', () => {
    BddTest().then('it should always use the 24-hour format', () => {
      const date = '2025-01-15T14:30:45'

      expect(formatTimeLocalized(date, 'fr', true)).toBe('14:30')
      expect(formatTimeLocalized(date, 'en', true)).toBe('14:30')
    })
  })

  BddTest().when('passing compact as true for an evening time', () => {
    BddTest().then('it should not use AM/PM', () => {
      const date = '2025-01-15T23:55:00'
      const formattedTime = formatTimeLocalized(date, 'en', true)

      expect(formattedTime).toBe('23:55')
      expect(formattedTime).not.toMatch(/AM|PM/)
    })
  })
})

BddTest().given('a localized abbreviated month getter', () => {
  const abbrFrMonthMap: Record<number, string> = {
    1: 'janv.',
    2: 'févr.',
    3: 'mars',
    4: 'avr.',
    5: 'mai',
    6: 'juin',
    7: 'juil.',
    8: 'août',
    9: 'sept.',
    10: 'oct.',
    11: 'nov.',
    12: 'déc.',
  }

  const abbrEnMonthMap: Record<number, string> = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  }

  BddTest().when('providing any month and locale', () => {
    BddTest().then('it should return the localized abbreviated month', () => {
      for (let i = 1; i <= 12; i++) {
        const month = String(i).padStart(2, '0')
        const date = `2025-${month}-01`

        expect(getLocalizedAbbrMonth(date, 'fr')).toBe(abbrFrMonthMap[i])
        expect(getLocalizedAbbrMonth(date, 'en')).toBe(abbrEnMonthMap[i])
      }
    })
  })
})

BddTest().given('a year-month to date formatter', () => {
  BddTest().when('providing a year-month string', () => {
    BddTest().then('it should add the first day of the month', () => {
      expect(formatYearMonthToDate('2025-02')).toBe('2025-02-01')
    })
  })

  BddTest().when('providing different months and years', () => {
    BddTest().then('it should format each date correctly', () => {
      expect(formatYearMonthToDate('2025-01')).toBe('2025-01-01')
      expect(formatYearMonthToDate('2025-06')).toBe('2025-06-01')
      expect(formatYearMonthToDate('2025-12')).toBe('2025-12-01')
      expect(formatYearMonthToDate('2020-03')).toBe('2020-03-01')
      expect(formatYearMonthToDate('2030-09')).toBe('2030-09-01')
    })
  })

  BddTest().when('providing an invalid year-month string', () => {
    BddTest().then('it should throw an error', () => {
      expect(() => formatYearMonthToDate('invalid-date')).toThrow()
      expect(() => formatYearMonthToDate('2025-13')).toThrow()
    })
  })
})

BddTest().given('a date to year-month formatter', () => {
  BddTest().when('providing a full ISO date with time', () => {
    BddTest().then('it should extract the year and month', () => {
      expect(formatDateToYearMonth('2025-05-23T14:31:50.007')).toBe('2025-05')
    })
  })

  BddTest().when('providing a date-only ISO string', () => {
    BddTest().then('it should extract the year and month', () => {
      expect(formatDateToYearMonth('2025-11-09')).toBe('2025-11')
    })
  })

  BddTest().when('providing a year-month string', () => {
    BddTest().then('it should return the year and month', () => {
      expect(formatDateToYearMonth('2025-08')).toBe('2025-08')
    })
  })

  BddTest().when('providing a Date object', () => {
    BddTest().then('it should extract the year and month', () => {
      expect(formatDateToYearMonth(new Date(2025, 4, 23))).toBe('2025-05')
    })
  })

  BddTest().when('providing a timestamp', () => {
    BddTest().then('it should extract the year and month', () => {
      const date = new Date(2025, 4, 23).getTime()

      expect(formatDateToYearMonth(date)).toBe('2025-05')
    })
  })

  BddTest().when('providing an invalid date string', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'not-a-date'

      expect(() => formatDateToYearMonth(date)).toThrow(`Invalid ISO date: ${date}`)
    })
  })

  BddTest().when('round-tripping with the year-month to date formatter', () => {
    BddTest().then('it should return the original year-month value', () => {
      const yearMonth = '2025-02'

      expect(formatDateToYearMonth(formatYearMonthToDate(yearMonth))).toBe(yearMonth)
    })
  })
})

BddTest().given('a localized year-month formatter', () => {
  BddTest().when('providing a full ISO date', () => {
    BddTest().then('it should format the year and month according to the locale', () => {
      const date = '2025-05-23T14:31:50.007'

      expect(formatDateToYearMonthLocalized(date, 'fr')).toBe('05/2025')
      expect(formatDateToYearMonthLocalized(date, 'en')).toBe('2025/05')
    })
  })

  BddTest().when('providing a date-only ISO string', () => {
    BddTest().then('it should format the year and month correctly', () => {
      const date = '2025-11-09'

      expect(formatDateToYearMonthLocalized(date, 'fr')).toBe('11/2025')
      expect(formatDateToYearMonthLocalized(date, 'en')).toBe('2025/11')
    })
  })

  BddTest().when('providing a year-month string', () => {
    BddTest().then('it should format the year and month correctly', () => {
      expect(formatDateToYearMonthLocalized('2025-08', 'fr')).toBe('08/2025')
      expect(formatDateToYearMonthLocalized('2025-08', 'en')).toBe('2025/08')
    })
  })

  BddTest().when('providing a Date object', () => {
    BddTest().then('it should format the year and month correctly', () => {
      const date = new Date(2025, 4, 23)

      expect(formatDateToYearMonthLocalized(date, 'fr')).toBe('05/2025')
      expect(formatDateToYearMonthLocalized(date, 'en')).toBe('2025/05')
    })
  })

  BddTest().when('providing an invalid date string', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'not-a-date'

      expect(() => formatDateToYearMonthLocalized(date, 'fr')).toThrow(`Invalid ISO date: ${date}`)
      expect(() => formatDateToYearMonthLocalized(date, 'en')).toThrow(`Invalid ISO date: ${date}`)
    })
  })
})

BddTest().given('a localized year formatter', () => {
  BddTest().when('providing a full ISO date with time', () => {
    BddTest().then('it should extract the year', () => {
      const date = '2025-05-23T14:31:50.007'

      expect(formatDateToYearLocalized(date, 'fr')).toBe('2025')
      expect(formatDateToYearLocalized(date, 'en')).toBe('2025')
    })
  })

  BddTest().when('providing a date-only ISO string', () => {
    BddTest().then('it should extract the year', () => {
      const date = '2027-02-01'

      expect(formatDateToYearLocalized(date, 'fr')).toBe('2027')
      expect(formatDateToYearLocalized(date, 'en')).toBe('2027')
    })
  })

  BddTest().when('providing a Date object', () => {
    BddTest().then('it should extract the year', () => {
      const date = new Date(2025, 4, 23)

      expect(formatDateToYearLocalized(date, 'fr')).toBe('2025')
      expect(formatDateToYearLocalized(date, 'en')).toBe('2025')
    })
  })

  BddTest().when('providing an invalid date string', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'not-a-date'

      expect(() => formatDateToYearLocalized(date, 'fr')).toThrow(`Invalid ISO date: ${date}`)
      expect(() => formatDateToYearLocalized(date, 'en')).toThrow(`Invalid ISO date: ${date}`)
    })
  })
})

BddTest().given('an instant formatter', () => {
  BddTest().when('providing a valid ISO instant', () => {
    BddTest().then('it should format the date and time using the default format', () => {
      const instant = '2025-05-23T14:31:50'

      expect(fromInstant(instant)).toBe(format(parseISO(instant), 'dd/MM/yyyy HH:mm'))
    })
  })

  BddTest().when('providing a valid ISO instant with timezone', () => {
    BddTest().then('it should format the instant in the local timezone', () => {
      const instant = '2025-05-23T14:31:50.007Z'

      expect(fromInstant(instant)).toBe(format(parseISO(instant), 'dd/MM/yyyy HH:mm'))
    })
  })

  BddTest().when('providing a custom output format', () => {
    BddTest().then('it should use the provided format', () => {
      const instant = '2025-05-23T14:31:50'

      expect(fromInstant(instant, 'yyyy-MM-dd')).toBe('2025-05-23')
      expect(fromInstant(instant, 'HH:mm:ss')).toBe('14:31:50')
    })
  })

  BddTest().when('providing an undefined value', () => {
    BddTest().then('it should return an empty string', () => {
      expect(fromInstant(undefined)).toBe('')
    })
  })

  BddTest().when('providing an empty string', () => {
    BddTest().then('it should return an empty string', () => {
      expect(fromInstant('')).toBe('')
    })
  })

  BddTest().when('providing an invalid instant', () => {
    BddTest().then('it should return an empty string', () => {
      expect(fromInstant('not-a-date')).toBe('')
    })
  })
})

BddTest().given('an instant converter', () => {
  BddTest().when('providing a valid date', () => {
    BddTest().then('it should convert the date to an ISO instant', () => {
      const date = '23/05/2025 14:30'
      const expected = new Date(2025, 4, 23, 14, 30).toISOString()

      expect(toInstant(date)).toBe(expected)
    })
  })

  BddTest().when('providing a date at midnight', () => {
    BddTest().then('it should preserve the midnight time', () => {
      const date = '01/01/2025 00:00'
      const expected = new Date(2025, 0, 1, 0, 0).toISOString()

      expect(toInstant(date)).toBe(expected)
    })
  })

  BddTest().when('providing a date with a single-digit day and month', () => {
    BddTest().then('it should parse the date correctly', () => {
      const date = '05/01/2025 09:05'
      const expected = new Date(2025, 0, 5, 9, 5).toISOString()

      expect(toInstant(date)).toBe(expected)
    })
  })

  BddTest().when('providing an undefined date', () => {
    BddTest().then('it should return undefined', () => {
      expect(toInstant(undefined)).toBeUndefined()
    })
  })

  BddTest().when('providing an empty date', () => {
    BddTest().then('it should return undefined', () => {
      expect(toInstant('')).toBeUndefined()
    })
  })
})
