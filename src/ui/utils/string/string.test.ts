import { formatTextToHtml } from '@/ui/utils/string/string'
import { describe, expect, it } from 'vitest'

describe('given a text with specific characteristics', () => {
  describe('when the input contains **...**', () => {
    it('then it should wrap it with a span with text-underline class', () => {
      const input = 'Here is an **important word** in the text.'
      const expected = 'Here is an <span class="text-underline">important word</span> in the text.'
      expect(formatTextToHtml(input)).toBe(expected)
    })

    it('then it should handle multiple underline markers', () => {
      const input = '**One** test **with multiple** words'
      const expected = '<span class="text-underline">One</span> test <span class="text-underline">with multiple</span> words'
      expect(formatTextToHtml(input)).toBe(expected)
    })

    it('then it should ignore unmatched or single asterisks', () => {
      const input = 'A *text* or **unfinished bold'
      const expected = 'A *text* or **unfinished bold'
      expect(formatTextToHtml(input)).toBe(expected)
    })
  })

  describe('when the input contains ##...##', () => {
    it('then it should wrap it with a strong tag with inline color style', () => {
      const input = 'This is ##colored text##.'
      const expected = 'This is <strong style="color: var(--dark-background-primary1)">colored text</strong>.'
      expect(formatTextToHtml(input)).toBe(expected)
    })

    it('then it should use the provided color', () => {
      const input = '##Colored## with custom color'
      const expected = '<strong style="color: red">Colored</strong> with custom color'
      expect(formatTextToHtml(input, 'red')).toBe(expected)
    })
  })

  describe('when the input contains (-... )', () => {
    it('then it should transform it into a list item with indentation class', () => {
      const input = '(-Item one)'
      const expected = '<li class="indented-list">Item one</li>'
      expect(formatTextToHtml(input)).toBe(expected)
    })

    it('then it should work with nested ** or ## styles inside list items', () => {
      const input = '(-**underlined** and ##colored##)'
      const expected = '<li class="indented-list"><span class="text-underline">underlined</span> and <strong style="color: var(--dark-background-primary1)">colored</strong></li>'
      expect(formatTextToHtml(input)).toBe(expected)
    })
  })

  describe('when the input contains line breaks', () => {
    it('then it should replace \\n with <div class="line-break"></div>', () => {
      const input = 'Line one\nLine two'
      const expected = 'Line one<div class="line-break"></div>Line two'
      expect(formatTextToHtml(input)).toBe(expected)
    })

    it('then it should handle all newline types (\\n, \\r, \\r\\n, \\\\n)', () => {
      const inputs = [
        'One\rTwo',
        'One\nTwo',
        'One\r\nTwo',
        'One\\nTwo',
        'One\\rTwo'
      ]
      inputs.forEach((input) => {
        const result = formatTextToHtml(input)
        expect(result).toBe('One<div class="line-break"></div>Two')
      })
    })
  })

  describe('when the input contains a combination of patterns', () => {
    it('then it should apply all transformations correctly', () => {
      const input = '(-**underline** then ##color##)\nNext **line**'
      const expected = '<li class="indented-list"><span class="text-underline">underline</span> then <strong style="color: var(--dark-background-primary1)">color</strong></li><div class="line-break"></div>Next <span class="text-underline">line</span>'
      expect(formatTextToHtml(input)).toBe(expected)
    })
  })

  describe('when the input contains no recognized patterns', () => {
    it('then it should return the input unchanged', () => {
      const input = 'Plain text without formatting'
      expect(formatTextToHtml(input)).toBe(input)
    })
  })
})
