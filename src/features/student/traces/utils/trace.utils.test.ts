import { getTraceComplementaryInfo } from '@/features/student/traces/utils/trace.utils'
import { describe, expect, it } from 'vitest'

describe('getTraceComplementaryInfo', () => {
  it('should return the file name when the trace has an attachment', () => {
    expect(getTraceComplementaryInfo({
      attachment: { fileName: 'cv.pdf' } as never,
      link: 'https://example.com'
    })).toBe('cv.pdf')
  })

  it('should return the link when the trace has no attachment', () => {
    expect(getTraceComplementaryInfo({ link: 'https://example.com' })).toBe('https://example.com')
  })

  it('should return undefined when the trace has neither', () => {
    expect(getTraceComplementaryInfo({})).toBeUndefined()
  })
})
