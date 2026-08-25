import type { AssociationSearchResultTraceDTO } from '@/api/avenir-esr'
import type { Association } from '@/features/student/global/types/associations.types'
import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { TraceAssociationTypes } from '@/features/student/traces/types/trace-association.types'
import { useI18n } from 'vue-i18n'

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

export function useTraceAssociationTypeConfig () {
  const { t } = useI18n()

  const traceAssociationTypeConfig = computed<AssociateElementTypeConfig>(() => ({
    key: EAssociationContextType.TRACE,
    label: t('student.traces.associations.label'),
    subConfigs: [
      {
        key: TraceAssociationTypes.ASSOCIATED,
        label: t('student.traces.associations.subConfigs.ASSOCIATED.label'),
        searchPlaceholder: t('student.traces.associations.subConfigs.ASSOCIATED.placeholder')
      },
      {
        key: TraceAssociationTypes.UNASSOCIATED,
        label: t('student.traces.associations.subConfigs.UNASSOCIATED.label'),
        searchPlaceholder: t('student.traces.associations.subConfigs.UNASSOCIATED.placeholder')
      }
    ]
  }))

  return { traceAssociationTypeConfig }
}
