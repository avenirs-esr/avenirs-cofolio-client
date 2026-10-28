/**
 * Parses a value into a finite number.
 *
 * @param value Value to parse, typically the raw value of an input.
 * @returns The parsed number, or `undefined` if the value is null, undefined, blank,
 * non-numeric or non-finite.
 *
 * @example
 * parseOptionalNumber('12.5') // 12.5
 * parseOptionalNumber('   ') // undefined (Number('   ') would give 0)
 * parseOptionalNumber('abc') // undefined
 */
export function parseOptionalNumber (value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined || String(value).trim() === '') {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed)
    ? parsed
    : undefined
}

/**
 * Formats a number with a fixed number of decimals.
 *
 * @param value Number to format.
 * @param decimals Number of decimals to display.
 * @returns The formatted number, or an empty string if the value is `undefined`.
 *
 * @example
 * formatOptionalNumber(1.2, 2) // '1.20'
 * formatOptionalNumber(1.005, 2) // '1.01' ((1.005).toFixed(2) would give '1.00')
 * formatOptionalNumber(undefined, 2) // ''
 */
export function formatOptionalNumber (value: number | undefined, decimals: number): string {
  return value === undefined
    ? ''
    : roundToDecimals(value, decimals).toFixed(decimals)
}

/**
 * Counts the decimals of a value.
 * Trailing zeros are counted for strings, and exponential notation is supported.
 *
 * @param value Number or numeric string.
 * @returns The number of decimals, or 0 for integers and empty strings.
 *
 * @example
 * countDecimals('12.50') // 2
 * countDecimals(12.50) // 1 (a number literal loses its trailing zero)
 * countDecimals(1e-7) // 7 (String(1e-7) gives '1e-7')
 */
export function countDecimals (value: string | number): number {
  const [mantissa = '', exponent = '0'] = String(value).toLowerCase().split('e')
  const decimals = (mantissa.split('.')[1]?.length ?? 0) - (Number(exponent) || 0)
  return Math.max(decimals, 0)
}

/**
 * Rounds a number to the given decimals, avoiding floating point errors.
 *
 * @param value Number to round.
 * @param decimals Number of decimals to keep.
 * @returns The rounded number.
 *
 * @example
 * roundToDecimals(12.345, 2) // 12.35
 * roundToDecimals(1.005, 2) // 1.01 (Math.round(1.005 * 100) / 100 would give 1)
 * roundToDecimals(-1.005, 2) // -1 (halves go towards positive infinity)
 */
export function roundToDecimals (value: number, decimals: number): number {
  const rounded = Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`)
  return Number.isFinite(rounded)
    ? rounded
    : Math.round(value * 10 ** decimals) / 10 ** decimals
}

/**
 * Returns the step matching a number of decimals, e.g. for the `step` attribute of an
 * `<input type="number">`.
 *
 * @param decimals Number of decimals.
 * @returns The smallest increment with that many decimals.
 *
 * @example
 * getStepFromDecimals(0) // 1
 * getStepFromDecimals(2) // 0.01
 * getStepFromDecimals(countDecimals('12.50')) // 0.01
 */
export function getStepFromDecimals (decimals: number): number {
  return 10 ** -decimals
}
