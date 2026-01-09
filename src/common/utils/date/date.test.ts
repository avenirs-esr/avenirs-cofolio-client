import {
  formatDateLocalized,
  formatDateToLocaleString,
  formatTimeLocalized,
  formatYearMonthToDate,
  getCalendarDate,
  getDaysUntil,
  getLocalizedAbbrMonth,
  parseDateISO
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

      const parsedDate1 = parseDateISO(date1)
      const parsedDate2 = parseDateISO(date2)
      const parsedDate3 = parseDateISO(date3)
      const parsedDate4 = parseDateISO(date4)
      const parsedDate5 = parseDateISO(date5)

      expect(parsedDate1.getTime()).toBe(parseISO(date1).getTime())
      expect(parsedDate2.getTime()).toBe(parseISO(date2).getTime())
      expect(parsedDate3.getTime()).toBe(parseISO(date3).getTime())
      expect(parsedDate4.getTime()).toBe(parseISO(date4).getTime())
      expect(parsedDate5.getTime()).toBe(parseISO(date5).getTime())
    })
  })

  BddTest().when('receiving a format that does not match', () => {
    BddTest().then('it should use fallback Date constructor', () => {
      const date = 'May 23, 2025 15:34:05 GMT+0200'
      const parsedDate = parseDateISO(date)
      expect(parsedDate instanceof Date).toBe(true)
      expect(parsedDate.getTime()).toBe(new Date(date).getTime())
    })
  })

  BddTest().when('receiving an invalid date', () => {
    BddTest().then('it should throw an error', () => {
      const date = 'not a date'
      expect(() => parseDateISO(date)).toThrow(`Invalid ISO date: ${date}`)
    })
  })
})

BddTest().given('a date to locale string formatter', () => {
  BddTest().when('providing a date and a locale string', () => {
    BddTest().then('it should format the date to the provided locale string', () => {
      const date = '2025-05-23T14:54'
      const formattedFrDate = formatDateToLocaleString(date, 'fr')
      const formattedEnDate = formatDateToLocaleString(date, 'en')

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
        const date = `2025-${i}-01`
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
        const date = `2025-07-${i}`
        const calendarDate = getCalendarDate(date)
        expect(calendarDate).toBe(i)
      }
    })
  })
})

BddTest().given('a days until getter', () => {
  BddTest().when('providing any date', () => {
    BddTest().then('it should return a correct number of days until given date', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const futureDate = new Date(today)
      futureDate.setDate(futureDate.getDate() + 30)

      const daysUntil = getDaysUntil(futureDate)
      expect(daysUntil).toBe(30)
    })
  })
})

BddTest().given('a localized date formatter', () => {
  BddTest().when('providing a date with time and a locale', () => {
    BddTest().then('it should format the date to the provided locale in dd MMMM yyyy format', () => {
      const date = '2025-01-15T14:30:00.000Z'
      const formattedFrDate = formatDateLocalized(date, 'fr')
      const formattedEnDate = formatDateLocalized(date, 'en')

      expect(formattedFrDate).toBe('15 janvier 2025')
      expect(formattedEnDate).toBe('15 January 2025')
    })
  })

  BddTest().when('providing a date without time', () => {
    BddTest().then('it should format the date correctly', () => {
      const date = '2025-12-25'
      const formattedFrDate = formatDateLocalized(date, 'fr')
      const formattedEnDate = formatDateLocalized(date, 'en')

      expect(formattedFrDate).toBe('25 décembre 2025')
      expect(formattedEnDate).toBe('25 December 2025')
    })
  })
})

BddTest().given('a localized time formatter', () => {
  BddTest().when('providing a date with time and a locale', () => {
    BddTest().then('it should format the time in 24-hour format', () => {
      const date = '2025-01-15T14:30:45.000Z'
      const formattedFrTime = formatTimeLocalized(date, 'fr')
      const formattedEnTime = formatTimeLocalized(date, 'en')

      expect(formattedFrTime).toMatch(/^\d{2}:\d{2}$/)
      expect(formattedEnTime).toMatch(/^\d{2}:\d{2}$/)
    })
  })

  BddTest().when('providing different times', () => {
    BddTest().then('it should format morning and evening times correctly', () => {
      const morningDate = '2025-01-15T09:05:00.000Z'
      const eveningDate = '2025-01-15T23:55:00.000Z'

      const morningTime = formatTimeLocalized(morningDate, 'fr')
      const eveningTime = formatTimeLocalized(eveningDate, 'fr')

      expect(morningTime).toMatch(/^\d{2}:05$/)
      expect(eveningTime).toMatch(/^\d{2}:55$/)
    })
  })
})

BddTest().given('a year-month to date formatter', () => {
  BddTest().when('providing a year-month string', () => {
    BddTest().then('it should format to dd/MM/yyyy with day as 01', () => {
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
})
