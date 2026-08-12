import { TraceAssociationTypes } from '@/features/student/traces'

export function useTraceAssociationModal () {
  const selectedTraceType = ref<{ itemId: TraceAssociationTypes }>({
    itemId: TraceAssociationTypes.UNASSOCIATED
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
    selectedTraceType,
    isAssociated
  }
}
