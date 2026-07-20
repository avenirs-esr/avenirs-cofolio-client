import {
  formatDateLocalized,
  formatDateToYearMonth,
  formatDateToYearMonthLocalized,
  formatTimeLocalized,
  formatYearMonthToDate,
  getCalendarDate,
  getDaysUntil,
  getLocalizedAbbrMonth,
  parseDate
} from '@/common/utils/date/date'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { parseISO } from 'date-fns'

BddTest().given('a dateISO parser', () => {
  BddTest().when('receiving a valid formatted date', () => {
    BddTest().then('it should parse ISO formats correctly', () => {
      const date1 = '2025-05-23T14:31:50.007Z'
      const date2 = '2025-05-23T14:32:50Z'
      const date3 = '2025-05-23T14:33:50'
      const date4 = '2025-05-23T14:34'
      const date5 = '2025-05-24'

      const parsedDate1 = parseDate(date1)
      const parsedDate2 = parseDate(date2)
      const parsedDate3 = parseDate(date3)
      const parsedDate4 = parseDate(date4)
      const parsedDate5 = parseDate(date5)

      expect(parsedDate1.getTime()).toBe(parseISO(date1).getTime())
      expect(parsedDate2.getTime()).toBe(parseISO(date2).getTime())
      expect(parsedDate3.getTime()).toBe(parseISO(date3).getTime())
      expect(parsedDate4.getTime()).toBe(parseISO(date4).getTime())
      expect(parsedDate5.getTime()).toBe(parseISO(date5).getTime())
    })
  })

  BddTest().when('receiving a timestamp (number)', () => {
    BddTest().then('it should return a Date built from that timestamp', () => {
      const timestamp = 1737000000000
      const parsedDate = parseDate(timestamp)
      expect(parsedDate.getTime()).toBe(new Date(timestamp).getTime())
    })
  })

  BddTest().when('receiving a Date object', () => {
    BddTest().then('it should return the same Date object untouched', () => {
      const date = new Date('2025-05-23T14:31:50.007Z')
      const parsedDate = parseDate(date)
      expect(parsedDate).toBe(date)
    })
  })

  BddTest().when('receiving a format that does not match', () => {
    BddTest().then('it should use fallback Date constructor', () => {
      const date = 'May 23, 2025 15:34:05 GMT+0200'
      const parsedDate = parseDate(date)
      expect(parsedDate.getTime()).toBe(new Date(date).getTime())
    })
  })

  BddTest().when('receiving an invalid date', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'not a date'
      expect(() => parseDate(date)).toThrow(`Invalid ISO date: ${date}`)
    })
  })
})

BddTest().given('a date to locale string formatter', () => {
  BddTest().when('providing a date and a locale string', () => {
    BddTest().then('it should format the date to the provided locale string', () => {
      const date = '2025-05-23T14:54'
      const formattedFrDate = formatDateLocalized(date, 'fr')
      const formattedEnDate = formatDateLocalized(date, 'en')

      expect(formattedFrDate).toBe('23 mai 2025')
      expect(formattedEnDate).toBe('May 23, 2025')
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
    12: 'déc.'
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
    12: 'Dec'
  }

  BddTest().when('providing any date and any locale', () => {
    BddTest().then('it should format the date to provided locale abbreviated month', () => {
      for (let i = 1; i <= 12; i++) {
        const month = String(i).padStart(2, '0')
        const date = `2025-${month}-01`

        const abbrFrMonth = getLocalizedAbbrMonth(date, 'fr')
        expect(abbrFrMonth).toBe(abbrFrMonthMap[i])

        const abbrEnMonth = getLocalizedAbbrMonth(date, 'en')
        expect(abbrEnMonth).toBe(abbrEnMonthMap[i])
      }
    })
  })
})

BddTest().given('a calendar date getter', () => {
  BddTest().when('providing any date', () => {
    BddTest().then('it should return a correct day number', () => {
      for (let i = 1; i <= 31; i++) {
        const day = String(i).padStart(2, '0')
        const date = `2025-07-${day}`
        const calendarDate = getCalendarDate(date)
        expect(calendarDate).toBe(i)
      }
    })
  })
})

BddTest().given('a days until getter', () => {
  BddTest().when('providing a future date', () => {
    BddTest().then('it should return a correct positive number of days until given date', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 30)

      const daysUntil = getDaysUntil(futureDate)
      expect(daysUntil).toBe(30)
    })
  })

  BddTest().when('providing today\'s date', () => {
    BddTest().then('it should return 0', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const daysUntil = getDaysUntil(today)
      expect(daysUntil).toBe(0)
    })
  })

  BddTest().when('providing a past date', () => {
    BddTest().then('it should return a negative number of days', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const pastDate = new Date(today)
      pastDate.setDate(pastDate.getDate() - 10)

      const daysUntil = getDaysUntil(pastDate)
      expect(daysUntil).toBe(-10)
    })
  })

  BddTest().when('providing a date with a non-midnight time', () => {
    BddTest().then('it should ignore the time part and only compare calendar days', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 5)
      futureDate.setHours(23, 59, 59, 999)

      const daysUntil = getDaysUntil(futureDate)
      expect(daysUntil).toBe(5)
    })
  })

  BddTest().when('providing an ISO date string instead of a Date object', () => {
    BddTest().then('it should return the correct number of days', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 7)
      const isoString = futureDate.toISOString().slice(0, 10)

      const daysUntil = getDaysUntil(isoString)
      expect(daysUntil).toBe(7)
    })
  })

  BddTest().when('providing a timestamp instead of a Date object', () => {
    BddTest().then('it should return the correct number of days', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 7)

      const daysUntil = getDaysUntil(futureDate.getTime())
      expect(daysUntil).toBe(7)
    })
  })
})

BddTest().given('a localized date formatter', () => {
  BddTest().when('providing a date with time and a locale, without compact mode', () => {
    BddTest().then('it should format the date to the provided locale in full format', () => {
      const date = '2025-01-15T14:30:00.000Z'
      const formattedFrDate = formatDateLocalized(date, 'fr')
      const formattedEnDate = formatDateLocalized(date, 'en')

      expect(formattedFrDate).toBe('15 janvier 2025')
      expect(formattedEnDate).toBe('January 15, 2025')
    })
  })

  BddTest().when('providing a date without time, without compact mode', () => {
    BddTest().then('it should format the date correctly in full format', () => {
      const date = '2025-12-25'
      const formattedFrDate = formatDateLocalized(date, 'fr')
      const formattedEnDate = formatDateLocalized(date, 'en')

      expect(formattedFrDate).toBe('25 décembre 2025')
      expect(formattedEnDate).toBe('December 25, 2025')
    })
  })

  BddTest().when('explicitly passing compact = false', () => {
    BddTest().then('it should behave the same as the default (full) format', () => {
      const date = '2025-03-08'
      const formattedFrDate = formatDateLocalized(date, 'fr', false)
      const formattedEnDate = formatDateLocalized(date, 'en', false)

      expect(formattedFrDate).toBe('8 mars 2025')
      expect(formattedEnDate).toBe('March 8, 2025')
    })
  })

  BddTest().when('passing compact = true', () => {
    BddTest().then('it should format the date in short numeric format, locale-specific', () => {
      const date = '2025-03-08'
      const formattedFrDate = formatDateLocalized(date, 'fr', true)
      const formattedEnDate = formatDateLocalized(date, 'en', true)

      expect(formattedFrDate).toBe('08/03/2025')
      expect(formattedEnDate).toBe('03/08/2025')
    })
  })

  BddTest().when('passing compact = true with a single-digit day and month', () => {
    BddTest().then('it should pad day and month with a leading zero', () => {
      const date = '2025-01-05'
      const formattedFrDate = formatDateLocalized(date, 'fr', true)
      const formattedEnDate = formatDateLocalized(date, 'en', true)

      expect(formattedFrDate).toBe('05/01/2025')
      expect(formattedEnDate).toBe('01/05/2025')
    })
  })
})

BddTest().given('a localized time formatter', () => {
  BddTest().when('providing a date with time and a locale, without compact mode', () => {
    BddTest().then('it should format the time in localized format', () => {
      const date = '2025-01-15T14:30:45.000Z'
      const formattedFrTime = formatTimeLocalized(date, 'fr')
      const formattedEnTime = formatTimeLocalized(date, 'en')

      expect(formattedFrTime).toBe('14:30')
      expect(formattedEnTime).toBe('2:30 PM')
    })
  })

  BddTest().when('providing different times, without compact mode', () => {
    BddTest().then('it should format morning and evening times correctly', () => {
      const morningDate = '2025-01-15T09:05:00.000Z'
      const eveningDate = '2025-01-15T23:55:00.000Z'

      const morningTime = formatTimeLocalized(morningDate, 'fr')
      const eveningTime = formatTimeLocalized(eveningDate, 'fr')

      expect(morningTime).toBe('09:05')
      expect(eveningTime).toBe('23:55')
    })
  })

  BddTest().when('explicitly passing compact = false', () => {
    BddTest().then('it should behave the same as the default (locale-specific) format', () => {
      const date = '2025-01-15T14:30:45.000Z'
      const formattedFrTime = formatTimeLocalized(date, 'fr', false)
      const formattedEnTime = formatTimeLocalized(date, 'en', false)

      expect(formattedFrTime).toBe('14:30')
      expect(formattedEnTime).toBe('2:30 PM')
    })
  })

  BddTest().when('passing compact = true', () => {
    BddTest().then('it should always format the time in 24-hour HH:mm, regardless of locale', () => {
      const date = '2025-01-15T14:30:45.000Z'
      const formattedFrTime = formatTimeLocalized(date, 'fr', true)
      const formattedEnTime = formatTimeLocalized(date, 'en', true)

      expect(formattedFrTime).toBe('14:30')
      expect(formattedEnTime).toBe('14:30')
    })
  })

  BddTest().when('passing compact = true for an afternoon time', () => {
    BddTest().then('it should not use the 12-hour AM/PM format even for the en locale', () => {
      const date = '2025-01-15T23:55:00.000Z'
      const formattedEnTime = formatTimeLocalized(date, 'en', true)

      expect(formattedEnTime).toBe('23:55')
      expect(formattedEnTime).not.toMatch(/AM|PM/)
    })
  })
})

BddTest().given('a year-month to date formatter', () => {
  BddTest().when('providing a year-month string', () => {
    BddTest().then('it should format to yyyy-MM-dd with day as 01', () => {
      const date = '2025-02'
      const formattedDate = formatYearMonthToDate(date)

      expect(formattedDate).toBe('2025-02-01')
    })
  })

  BddTest().when('providing different months', () => {
    BddTest().then('it should format each month correctly', () => {
      expect(formatYearMonthToDate('2025-01')).toBe('2025-01-01')
      expect(formatYearMonthToDate('2025-06')).toBe('2025-06-01')
      expect(formatYearMonthToDate('2025-12')).toBe('2025-12-01')
    })
  })

  BddTest().when('providing different years', () => {
    BddTest().then('it should format each year correctly', () => {
      expect(formatYearMonthToDate('2020-03')).toBe('2020-03-01')
      expect(formatYearMonthToDate('2030-09')).toBe('2030-09-01')
    })
  })

  BddTest().when('providing an invalid year-month string', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'invalid-date'
      expect(() => formatYearMonthToDate(date)).toThrow('Invalid time value')
    })
  })

  BddTest().when('providing a year-month string with an out-of-range month', () => {
    BddTest().then('it should throw an error', () => {
      const date = '2025-13'
      expect(() => formatYearMonthToDate(date)).toThrow('Invalid time value')
    })
  })
})

BddTest().given('a date to year-month formatter', () => {
  BddTest().when('providing a full ISO date with time', () => {
    BddTest().then('it should extract the year-month part', () => {
      const date = '2025-05-23T14:31:50.007Z'
      expect(formatDateToYearMonth(date)).toBe('2025-05')
    })
  })

  BddTest().when('providing a date-only ISO string', () => {
    BddTest().then('it should extract the year-month part', () => {
      const date = '2025-11-09'
      expect(formatDateToYearMonth(date)).toBe('2025-11')
    })
  })

  BddTest().when('providing a year-month string directly', () => {
    BddTest().then('it should return the same year-month string', () => {
      const date = '2025-08'
      expect(formatDateToYearMonth(date)).toBe('2025-08')
    })
  })

  BddTest().when('providing an invalid date string', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'not-a-date'
      expect(() => formatDateToYearMonth(date)).toThrow(`Invalid ISO date: ${date}`)
    })
  })

  BddTest().when('round-tripping with formatYearMonthToDate', () => {
    BddTest().then('it should return the original year-month value', () => {
      const yearMonth = '2025-02'
      const fullDate = formatYearMonthToDate(yearMonth)
      expect(formatDateToYearMonth(fullDate)).toBe(yearMonth)
    })
  })
})

BddTest().given('a date to year-month localized formatter', () => {
  BddTest().when('providing a full ISO date with time', () => {
    BddTest().then('it should extract the year-month part', () => {
      const date = '2025-05-23T14:31:50.007Z'
      expect(formatDateToYearMonthLocalized(date, 'fr')).toBe('05/2025')
      expect(formatDateToYearMonthLocalized(date, 'en')).toBe('2025/05')
    })
  })

  BddTest().when('providing a date-only ISO string', () => {
    BddTest().then('it should extract the year-month part', () => {
      const date = '2025-11-09'
      expect(formatDateToYearMonthLocalized(date, 'fr')).toBe('11/2025')
      expect(formatDateToYearMonthLocalized(date, 'en')).toBe('2025/11')
    })
  })

  BddTest().when('providing a year-month string directly', () => {
    BddTest().then('it should return the same year-month string', () => {
      const date = '2025-08'
      expect(formatDateToYearMonthLocalized(date, 'fr')).toBe('08/2025')
      expect(formatDateToYearMonthLocalized(date, 'en')).toBe('2025/08')
    })
  })

  BddTest().when('providing an invalid date string', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'not-a-date'
      expect(() => formatDateToYearMonthLocalized(date, 'fr')).toThrow(`Invalid ISO date: ${date}`)
      expect(() => formatDateToYearMonthLocalized(date, 'en')).toThrow(`Invalid ISO date: ${date}`)
    })
  })

  BddTest().when('round-tripping with formatYearMonthToDate', () => {
    BddTest().then('it should return the original year-month value', () => {
      const yearMonth = '2025-02'
      const fullDate = formatYearMonthToDate(yearMonth)
      expect(formatDateToYearMonthLocalized(fullDate, 'fr')).toBe('02/2025')
      expect(formatDateToYearMonthLocalized(fullDate, 'en')).toBe('2025/02')
    })
  })
})
