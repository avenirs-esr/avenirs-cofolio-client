import { ETraceAuthorType } from '@/api/avenir-esr'
import { type TraceFormDataFile, type TraceFormDataLink, TraceType } from '@/features/traces/types/traces.types'
import { isTraceFileType, isTraceLinkType } from '@/features/traces/utils/trace.types-guard'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('trace form data type guards', () => {
  BddTest().when('the trace type is FILE', () => {
    const fileTrace: TraceFormDataFile = {
      traceType: TraceType.FILE,
      file: null,
      traceName: 'my-trace',
      authorType: ETraceAuthorType.PERSONAL,
      useIA: false,
      valorized: false,
    }

    BddTest().then('isTraceFileType should return true', () => {
      expect(isTraceFileType(fileTrace)).toBe(true)
    })

    BddTest().then('isTraceLinkType should return false', () => {
      expect(isTraceLinkType(fileTrace)).toBe(false)
    })
  })

  BddTest().when('the trace type is LINK', () => {
    const linkTrace: TraceFormDataLink = {
      traceType: TraceType.LINK,
      link: 'https://www.google.com',
      traceName: 'my-trace',
      authorType: ETraceAuthorType.PERSONAL,
      useIA: false,
      valorized: false,
    }

    BddTest().then('isTraceFileType should return false', () => {
      expect(isTraceFileType(linkTrace)).toBe(false)
    })

    BddTest().then('isTraceLinkType should return true', () => {
      expect(isTraceLinkType(linkTrace)).toBe(true)
    })
  })
})
