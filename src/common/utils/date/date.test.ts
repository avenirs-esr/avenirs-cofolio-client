import { parseISO } from 'date-fns'
import { formatDateToLocaleString, getLocalizedAbbrMonth, parseDateISO } from './date'

describe('parseDateISO', () => {
  it('should parse ISO formats correctly with valid formatted date', () => {
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

  it('should use fallback Date constructor with a format that does not match', () => {
    const date = 'May 23, 2025 15:34:05 GMT+0200'
    const parsedDate = parseDateISO(date)
    expect(parsedDate instanceof Date).toBe(true)
    expect(parsedDate.getTime()).toBe(new Date(date).getTime())
  })

  it('should throw an error with an invalid date', () => {
    const date = 'not a date'
    expect(() => parseDateISO(date)).toThrow(`Invalid ISO date: ${date}`)
  })
})

describe('formatDateToLocaleString', () => {
  it('should format a date to provided locale string', () => {
    const date = new Date('2025-05-23T14:54')
    const formattedFrDate = formatDateToLocaleString(date, 'fr')
    const formattedEnDate = formatDateToLocaleString(date, 'en')

    expect(formattedFrDate).toBe('23 mai 2025')
    expect(formattedEnDate).toBe('May 23, 2025')
  })
})

describe('getLocalizedAbbrMonth', () => {
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

  it('should format a date to provided locale abbreviated month', () => {
    for (let i = 1; i <= 12; i++) {
      const date = new Date(`2025-${i}-01`)
      const abbrFrMonth = getLocalizedAbbrMonth(date, 'fr')
      expect(abbrFrMonth).toBe(abbrFrMonthMap[i])
      const abbrEnMonth = getLocalizedAbbrMonth(date, 'en')
      expect(abbrEnMonth).toBe(abbrEnMonthMap[i])
    }
  })
})
