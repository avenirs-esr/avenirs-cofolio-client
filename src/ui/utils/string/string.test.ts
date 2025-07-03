import { formatTextToUnderlineHtml } from '@/ui/utils/string/string'
import { describe, expect, it } from 'vitest'

describe('formatTextToUnderlineHtml', () => {
  it('replaces text wrapped in ** with a span with text-underline class', () => {
    const input = 'Here is an **important word** in the text.'
    const expected = 'Here is an <span class="text-underline">important word</span> in the text.'
    expect(formatTextToUnderlineHtml(input)).toBe(expected)
  })

  it('replaces multiple occurrences of text wrapped in **', () => {
    const input = '**One** test **with multiple** bold words'
    const expected = '<span class="text-underline">One</span> test <span class="text-underline">with multiple</span> bold words'
    expect(formatTextToUnderlineHtml(input)).toBe(expected)
  })

  it('does not modify text without **', () => {
    const input = 'Text without markdown'
    expect(formatTextToUnderlineHtml(input)).toBe(input)
  })

  it('ignores unmatched or single asterisks', () => {
    const input = 'A *text* or **unfinished bold'
    const expected = 'A *text* or **unfinished bold'
    expect(formatTextToUnderlineHtml(input)).toBe(expected)
  })
})
