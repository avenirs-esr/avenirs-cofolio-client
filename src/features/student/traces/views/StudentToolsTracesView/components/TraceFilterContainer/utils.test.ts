import { TraceFilterFileTypesItem } from '@/api/avenir-esr'
import { FileGlobalType } from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.types'
import { computeTraceFilterFileTypesFromGlobals } from '@/features/student/traces/views/StudentToolsTracesView/components/TraceFilterContainer/utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('a computeTraceFilterFileTypesFromGlobals function', () => {
  BddTest().when('it is called with FileGlobalType.PDF', () => {
    const result = computeTraceFilterFileTypesFromGlobals([FileGlobalType.PDF])

    BddTest().then('it should return an array with TraceFilterFileTypesItem.PDF', () => {
      expect(result).toEqual([TraceFilterFileTypesItem.PDF])
    })
  })

  BddTest().when('it is called with FileGlobalType.TEXT', () => {
    const result = computeTraceFilterFileTypesFromGlobals([FileGlobalType.TEXT])

    BddTest().then('it should return an array with the corresponding TraceFilterFileTypesItem', () => {
      expect(result).toEqual([
        TraceFilterFileTypesItem.TXT,
        TraceFilterFileTypesItem.CSV,
        TraceFilterFileTypesItem.ICS,
        TraceFilterFileTypesItem.RICHTEXT,
        TraceFilterFileTypesItem.RTF,
        TraceFilterFileTypesItem.X_RTF,
        TraceFilterFileTypesItem.POSTSCRIPT,
        TraceFilterFileTypesItem.DOC,
        TraceFilterFileTypesItem.DOCX,
        TraceFilterFileTypesItem.ODT,
      ])
    })
  })

  BddTest().when('it is called with something else than FileGlobalType', () => {
    const result = computeTraceFilterFileTypesFromGlobals(['OTHER' as FileGlobalType])

    BddTest().then('it should return an empty array', () => {
      expect(result).toEqual([])
    })
  })
})
