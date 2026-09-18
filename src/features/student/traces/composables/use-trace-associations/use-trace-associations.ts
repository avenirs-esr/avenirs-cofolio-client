import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { useI18n } from 'vue-i18n'

export function useTraceAssociationTypeConfig () {
  const { t } = useI18n()

  const traceAssociationTypeConfig = computed<AssociateElementTypeConfig>(() => ({
    key: EAssociationContextType.TRACE,
    label: t('student.traces.associations.label'),
    searchPlaceholder: t('student.traces.associations.placeholder')
  }))

  return { traceAssociationTypeConfig }
}
