import {
  highlightCaptionText,
  highlightMatchedText,
  highlightTitleText,
} from '@/common/utils/highlight/highlight'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('a highlight text utility', () => {
  BddTest().when('query is empty or whitespace', () => {
    BddTest().then('it should return original text', () => {
      expect(highlightMatchedText('Voici un test', '', 'x')).toBe('Voici un test')
      expect(highlightMatchedText('Voici un test', '   ', 'x')).toBe('Voici un test')
    })
  })

  BddTest().when('query matches once', () => {
    BddTest().then('it should wrap the match with span and class', () => {
      const res = highlightMatchedText('Voici un test', 'test', 'b1-bold')
      expect(res).toBe('Voici un <span class="b1-bold highlight">test</span>')
    })
  })

  BddTest().when('query matches multiple times', () => {
    BddTest().then('it should wrap all occurrences', () => {
      const res = highlightMatchedText('abc abc abc', 'abc', 'mark')
      expect(res).toBe('<span class="mark highlight">abc</span> <span class="mark highlight">abc</span> <span class="mark highlight">abc</span>')
    })
  })

  BddTest().when('matching is case-insensitive', () => {
    BddTest().then('it should highlight regardless of case', () => {
      const res = highlightMatchedText('JavaScript javascript JaVaScRiPt', 'javascript', 'hit')
      expect(res).toBe('<span class="hit highlight">JavaScript</span> <span class="hit highlight">javascript</span> <span class="hit highlight">JaVaScRiPt</span>')
    })
  })

  BddTest().when('query contains regex special characters', () => {
    BddTest().then('it should escape special characters before matching', () => {
      const res = highlightMatchedText('Find (this) + that?', '(this) +', 'x')
      expect(res).toBe('Find <span class="x highlight">(this) +</span> that?')
    })
  })

  BddTest().when('highlightTitleText is used', () => {
    BddTest().then('it should use the b1-bold class', () => {
      const res = highlightTitleText('Hello Title', 'Hello')
      expect(res).toBe('<span class="b1-bold highlight">Hello</span> Title')
    })
  })

  BddTest().when('highlightCaptionText is used', () => {
    BddTest().then('it should use the caption-light class', () => {
      const res = highlightCaptionText('Caption text here', 'text')
      expect(res).toBe('Caption <span class="caption-light highlight">text</span> here')
    })
  })
})
