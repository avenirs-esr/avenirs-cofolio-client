import type { TraceFilter } from '@/features/student/types'
import { BddTest, mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { useTraceFilters } from './use-trace-filters'

BddTest().given('a trace filters composable', () => {
  let composableResult: ReturnType<typeof useTraceFilters>

  BddTest().when('the composable is initialized without initial criteria', () => {
    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(), {})
      composableResult = result.result
    })

    BddTest().then('it should initialize with empty keyword', () => {
      expect(composableResult.traceFilter.value).toEqual({
        keyword: ''
      })
    })
  })

  BddTest().when('the composable is initialized with initial criteria', () => {
    const initialCriteria: TraceFilter = {
      keyword: 'test keyword'
    }

    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(initialCriteria), {})
      composableResult = result.result
    })

    BddTest().then('it should initialize with the provided keyword', () => {
      expect(composableResult.traceFilter.value).toEqual({
        keyword: 'test keyword'
      })
    })
  })

  BddTest().when('the search criteria is changed', () => {
    const newCriteria: TraceFilter = {
      keyword: 'new search term'
    }

    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(), {})
      composableResult = result.result
      composableResult.handleChangeTraceFilter(newCriteria)
    })

    BddTest().then('it should update the search criteria', () => {
      expect(composableResult.traceFilter.value).toEqual({
        keyword: 'new search term'
      })
    })
  })

  BddTest().when('the search criteria is changed multiple times', () => {
    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters(), {})
      composableResult = result.result
      composableResult.handleChangeTraceFilter({ keyword: 'first' })
      composableResult.handleChangeTraceFilter({ keyword: 'second' })
      composableResult.handleChangeTraceFilter({ keyword: 'third' })
    })

    BddTest().then('it should update to the latest criteria', () => {
      expect(composableResult.traceFilter.value).toEqual({
        keyword: 'third'
      })
    })
  })

  BddTest().when('the search criteria is reset to empty', () => {
    beforeEach(() => {
      const result = mountComposable(() => useTraceFilters({ keyword: 'initial' }), {})
      composableResult = result.result
      composableResult.handleChangeTraceFilter({ keyword: '' })
    })

    BddTest().then('it should clear the keyword', () => {
      expect(composableResult.traceFilter.value).toEqual({
        keyword: ''
      })
    })
  })
})
