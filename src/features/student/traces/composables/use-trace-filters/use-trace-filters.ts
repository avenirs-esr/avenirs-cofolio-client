import type { TraceFilter, TracesViewParams } from '@/api/avenir-esr'
import type { UseTracesViewQueryParams } from '@/features/student/queries'
import type { DateFilter, SearchFilter } from '@/types'
import type { Ref } from 'vue'

interface UseTraceFiltersProps {
  isAssociated: boolean
}

interface UseTraceFiltersReturn {
  tracesViewQueryParams: UseTracesViewQueryParams
  onUpdateFilters: (newFilters: TraceFilter & DateFilter & SearchFilter) => void
}

export function useTraceFilters ({ isAssociated }: UseTraceFiltersProps): UseTraceFiltersReturn {
  const params: Ref<TracesViewParams> = ref({ })
  const traceFilter: Ref<TraceFilter> = ref({ isAssociated })

  function onUpdateFilters (newFilters: TraceFilter & DateFilter & SearchFilter) {
    const traceFilterUpdates: TraceFilter = {}
    const paramsUpdates: TracesViewParams = {}

    if (newFilters.fileTypes) {
      traceFilterUpdates.fileTypes = newFilters.fileTypes
    }
    if (newFilters.isAssociated) {
      traceFilterUpdates.isAssociated = newFilters.isAssociated
    }
    if (newFilters.skillIds) {
      traceFilterUpdates.skillIds = newFilters.skillIds
    }
    if (newFilters.statuses) {
      traceFilterUpdates.statuses = newFilters.statuses
    }

    if (newFilters.fromDate || newFilters.fromDate === '') {
      paramsUpdates.fromDate = newFilters.fromDate
    }
    if (newFilters.toDate || newFilters.toDate === '') {
      paramsUpdates.toDate = newFilters.toDate
    }
    if (newFilters.keyword || newFilters.keyword === '') {
      paramsUpdates.keyword = newFilters.keyword
    }

    traceFilter.value = { ...traceFilter.value, ...traceFilterUpdates }
    params.value = { ...params.value, ...paramsUpdates }
  }

  return {
    tracesViewQueryParams: { traceFilter, params },
    onUpdateFilters
  }
}
