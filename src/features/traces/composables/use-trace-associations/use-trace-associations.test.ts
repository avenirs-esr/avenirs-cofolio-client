import { EAssociationContextType } from '@/api/avenir-esr'
import { useTraceAssociationModal, useTraceAssociationTypeConfig } from '@/features/traces/composables/use-trace-associations/use-trace-associations'
import { TraceAssociationTypes } from '@/features/traces/types/trace-association.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { expect } from 'vitest'

BddTest().given('a useTraceAssociationModal composable', () => {
  BddTest().when('the composable is initialized', () => {
    const { selectedTraceType, isAssociated } = useTraceAssociationModal()

    BddTest().then('it should default to UNASSOCIATED', () => {
      expect(selectedTraceType.value).toEqual({ itemId: TraceAssociationTypes.UNASSOCIATED })
    })

    BddTest().then('isAssociated should be false', () => {
      expect(isAssociated.value).toBe(false)
    })
  })

  BddTest().when('the selected trace type is ASSOCIATED', () => {
    const { selectedTraceType, isAssociated } = useTraceAssociationModal()
    selectedTraceType.value = { itemId: TraceAssociationTypes.ASSOCIATED }

    BddTest().then('isAssociated should be true', () => {
      expect(isAssociated.value).toBe(true)
    })
  })

  BddTest().when('the selected trace type is UNASSOCIATED', () => {
    const { selectedTraceType, isAssociated } = useTraceAssociationModal()
    selectedTraceType.value = { itemId: TraceAssociationTypes.UNASSOCIATED }

    BddTest().then('isAssociated should be false', () => {
      expect(isAssociated.value).toBe(false)
    })
  })

  BddTest().when('the selected trace type is ALL', () => {
    const { selectedTraceType, isAssociated } = useTraceAssociationModal()
    selectedTraceType.value = { itemId: TraceAssociationTypes.ALL }

    BddTest().then('isAssociated should be undefined', () => {
      expect(isAssociated.value).toBeUndefined()
    })
  })
})

BddTest().given('a useTraceAssociationTypeConfig composable', () => {
  BddTest().when('the composable is initialized', () => {
    const { result: { traceAssociationTypeConfig } } = mountComposable(() => useTraceAssociationTypeConfig(), { useI18n: true })

    BddTest().then('it should build the trace association type config', () => {
      expect(traceAssociationTypeConfig.value).toStrictEqual({
        key: EAssociationContextType.TRACE,
        label: 'Mes traces',
        subConfigs: [
          {
            key: TraceAssociationTypes.ASSOCIATED,
            label: 'associées',
            searchPlaceholder: 'Rechercher une trace associée...'
          },
          {
            key: TraceAssociationTypes.UNASSOCIATED,
            label: 'non associées',
            searchPlaceholder: 'Rechercher une trace non associée...'
          }
        ]
      })
    })
  })
})
