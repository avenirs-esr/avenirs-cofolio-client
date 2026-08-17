import type { AssociationSearchResultTraceDTO } from '@/api/avenir-esr'
import type { Association } from '@/features/student/global/types/associations.types'
import { TraceAssociationTypes } from '@/features/student/traces'

export function useTraceAssociationModal () {
  const selectedTraceType = ref<{ itemId: TraceAssociationTypes }>({
    itemId: TraceAssociationTypes.UNASSOCIATED
  })

  const mapTraceAssociationSearchResultToAssociation = (trace: AssociationSearchResultTraceDTO): Association => ({
    id: trace.id,
    title: trace.title,
    disabled: trace.disabled,
  })

  const isAssociated = computed(() => {
    switch (selectedTraceType.value.itemId) {
      case TraceAssociationTypes.ASSOCIATED:
        return true
      case TraceAssociationTypes.UNASSOCIATED:
        return false
      default:
        return undefined
    }
  })

  return {
    mapTraceAssociationSearchResultToAssociation,
    selectedTraceType,
    isAssociated
  }
}
