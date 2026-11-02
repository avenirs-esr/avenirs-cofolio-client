import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'
import {
  countDecimals,
  formatOptionalNumber,
  getStepFromDecimals,
  parseOptionalNumber,
  roundToDecimals,
} from '@/common/utils/number/number'

BddTest().given('parseOptionalNumber', () => {
  BddTest().when('it is called with null or undefined', () => {
    BddTest().then('it should return undefined', () => {
      expect(parseOptionalNumber(null)).toBeUndefined()
      expect(parseOptionalNumber(undefined)).toBeUndefined()
    })
  })

  BddTest().when('it is called with an empty or blank string', () => {
    BddTest().then('it should return undefined', () => {
      expect(parseOptionalNumber('')).toBeUndefined()
      expect(parseOptionalNumber('   ')).toBeUndefined()
    })
  })

  BddTest().when('it is called with a non-numeric string', () => {
    BddTest().then('it should return undefined', () => {
      expect(parseOptionalNumber('abc')).toBeUndefined()
    })
  })

  BddTest().when('it is called with a non-finite value', () => {
    BddTest().then('it should return undefined', () => {
      expect(parseOptionalNumber(Number.POSITIVE_INFINITY)).toBeUndefined()
      expect(parseOptionalNumber(Number.NaN)).toBeUndefined()
    })
  })

  BddTest().when('it is called with a numeric string', () => {
    BddTest().then('it should return the parsed number', () => {
      expect(parseOptionalNumber('12.5')).toBe(12.5)
      expect(parseOptionalNumber('-1')).toBe(-1)
    })
  })

  BddTest().when('it is called with zero', () => {
    BddTest().then('it should return zero', () => {
      expect(parseOptionalNumber(0)).toBe(0)
      expect(parseOptionalNumber('0')).toBe(0)
    })
  })
})

BddTest().given('formatOptionalNumber', () => {
  BddTest().when('it is called with undefined', () => {
    BddTest().then('it should return an empty string', () => {
      expect(formatOptionalNumber(undefined, 2)).toBe('')
    })
  })

  BddTest().when('it is called with a number', () => {
    BddTest().then('it should format it with the given decimals', () => {
      expect(formatOptionalNumber(20, 0)).toBe('20')
      expect(formatOptionalNumber(1.2, 2)).toBe('1.20')
    })
  })

  BddTest().when('it is called with zero', () => {
    BddTest().then('it should format the zero', () => {
      expect(formatOptionalNumber(0, 0)).toBe('0')
      expect(formatOptionalNumber(0, 2)).toBe('0.00')
    })
  })

  BddTest().when('the number has more decimals than requested', () => {
    BddTest().then('it should round it like roundToDecimals', () => {
      expect(formatOptionalNumber(1.005, 2)).toBe('1.01')
    })
  })
})

BddTest().given('countDecimals', () => {
  BddTest().when('it is called with an integer', () => {
    BddTest().then('it should return 0', () => {
      expect(countDecimals(12)).toBe(0)
      expect(countDecimals('12')).toBe(0)
    })
  })

  BddTest().when('it is called with a decimal value', () => {
    BddTest().then('it should return the number of decimals', () => {
      expect(countDecimals(12.5)).toBe(1)
      expect(countDecimals('-1.25')).toBe(2)
    })
  })

  BddTest().when('it is called with a string having trailing zeros', () => {
    BddTest().then('it should count the trailing zeros', () => {
      expect(countDecimals('12.50')).toBe(2)
    })
  })

  BddTest().when('it is called with an empty string', () => {
    BddTest().then('it should return 0', () => {
      expect(countDecimals('')).toBe(0)
    })
  })

  BddTest().when('it is called with an exponential notation', () => {
    BddTest().then('it should count the decimals of the expanded value', () => {
      expect(countDecimals(1e-7)).toBe(7)
      expect(countDecimals('1.25e-5')).toBe(7)
      expect(countDecimals(1.5e21)).toBe(0)
    })
  })
})

BddTest().given('roundToDecimals', () => {
  BddTest().when('the value has more decimals than requested', () => {
    BddTest().then('it should round it', () => {
      expect(roundToDecimals(12.345, 2)).toBe(12.35)
      expect(roundToDecimals(12.344, 2)).toBe(12.34)
    })
  })

  BddTest().when('the value is subject to floating point errors', () => {
    BddTest().then('it should round it as expected', () => {
      expect(roundToDecimals(1.005, 2)).toBe(1.01)
    })
  })

  BddTest().when('no decimal is requested', () => {
    BddTest().then('it should round to an integer', () => {
      expect(roundToDecimals(12.5, 0)).toBe(13)
    })
  })

  BddTest().when('the value has fewer decimals than requested', () => {
    BddTest().then('it should return the value unchanged', () => {
      expect(roundToDecimals(20, 2)).toBe(20)
      expect(roundToDecimals(1.2, 2)).toBe(1.2)
    })
  })

  BddTest().when('the value is negative', () => {
    BddTest().then('it should round it', () => {
      expect(roundToDecimals(-12.346, 2)).toBe(-12.35)
    })
  })

  BddTest().when('the value is in exponential notation', () => {
    BddTest().then('it should fall back to the arithmetic rounding', () => {
      expect(roundToDecimals(1e-7, 2)).toBe(0)
    })
  })
})

BddTest().given('getStepFromDecimals', () => {
  BddTest().when('it is called with a number of decimals', () => {
    BddTest().then('it should return the matching step', () => {
      expect(getStepFromDecimals(0)).toBe(1)
      expect(getStepFromDecimals(1)).toBe(0.1)
      expect(getStepFromDecimals(2)).toBe(0.01)
    })
  })
})
