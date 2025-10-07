import type { TraceFilter } from '@/features/student/types'
import type { Ref } from 'vue'

export function useTraceFilters (initialTraceFilter?: TraceFilter) {
  const traceFilter: Ref<TraceFilter> = ref(initialTraceFilter ?? {
    keyword: ''
  })

  function handleChangeTraceFilter (updatedTraceFilter: TraceFilter) {
    traceFilter.value = updatedTraceFilter
  }

  return {
    traceFilter,
    handleChangeTraceFilter
  }
}
