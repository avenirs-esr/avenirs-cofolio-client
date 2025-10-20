import type { DateFilter, SearchFilter } from '@/types'
import { type TraceFilter, TraceFilterFileTypesItem, TraceFilterStatusesItem } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { useTraceFilters } from './use-trace-filters'

BddTest().given('a useTraceFilters composable', () => {
  let useTraceFiltersResult: ReturnType<typeof useTraceFilters>

  const defaultProps = { isAssociated: false }

  BddTest().when('the composable is initialized', () => {
    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(defaultProps), {})
      useTraceFiltersResult = result.result
    })

    BddTest().then('it should initialize traceFilter and params with default values', () => {
      expect(useTraceFiltersResult.tracesViewQueryParams.traceFilter.value).toEqual({ isAssociated: false })
      expect(useTraceFiltersResult.tracesViewQueryParams.params.value).toEqual({ })
    })
  })

  BddTest().when('filters are updated with new values', () => {
    const newFilters: TraceFilter & DateFilter & SearchFilter = {
      isAssociated: true,
      fileTypes: [TraceFilterFileTypesItem.PDF],
      skillIds: ['skill-1', 'skill-2'],
      statuses: [TraceFilterStatusesItem.ASSOCIATED_EVALUATED],
      fromDate: '2025-10-09',
      toDate: '2025-10-10',
      keyword: 'example'
    }

    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(defaultProps), {})
      useTraceFiltersResult = result.result
      useTraceFiltersResult.onUpdateFilters(newFilters)
    })

    BddTest().then('it should merge traceFilter and params correctly', () => {
      expect(useTraceFiltersResult.tracesViewQueryParams.traceFilter.value).toEqual({
        isAssociated: true,
        fileTypes: [TraceFilterFileTypesItem.PDF],
        skillIds: ['skill-1', 'skill-2'],
        statuses: [TraceFilterStatusesItem.ASSOCIATED_EVALUATED],
      })

      expect(useTraceFiltersResult.tracesViewQueryParams.params.value).toEqual({
        fromDate: '2025-10-09',
        toDate: '2025-10-10',
        keyword: 'example'
      })
    })
  })

  BddTest().when('filters are updated partially', () => {
    const partialFilters: Partial<TraceFilter & DateFilter & SearchFilter> = {
      keyword: 'search term'
    }

    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(defaultProps), {})
      useTraceFiltersResult = result.result
      useTraceFiltersResult.onUpdateFilters(partialFilters as any)
    })

    BddTest().then('it should only update keyword in params', () => {
      expect(useTraceFiltersResult.tracesViewQueryParams.traceFilter.value).toEqual({ isAssociated: false })
      expect(useTraceFiltersResult.tracesViewQueryParams.params.value).toEqual({
        keyword: 'search term'
      })
    })
  })

  BddTest().when('filters are reset (keyword and dates removed)', () => {
    const resetFilters: TraceFilter & DateFilter & SearchFilter = {
      isAssociated: false,
      keyword: '',
      fromDate: undefined,
      toDate: undefined
    }

    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(defaultProps), {})
      useTraceFiltersResult = result.result
      useTraceFiltersResult.onUpdateFilters(resetFilters)
    })

    BddTest().then('it should not include undefined values in params', () => {
      expect(useTraceFiltersResult.tracesViewQueryParams.params.value).toEqual({
        keyword: ''
      })
    })
  })

  BddTest().when('filters are updated multiple times', () => {
    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(defaultProps), {})
      useTraceFiltersResult = result.result

      useTraceFiltersResult.onUpdateFilters({ keyword: 'first' })
      useTraceFiltersResult.onUpdateFilters({ keyword: 'second' })
      useTraceFiltersResult.onUpdateFilters({ keyword: 'third' })
    })

    BddTest().then('it should keep the latest params', () => {
      expect(useTraceFiltersResult.tracesViewQueryParams.params.value.keyword).toBe('third')
    })
  })
})
