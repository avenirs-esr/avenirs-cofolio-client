import { useTraceAssociationModal } from '@/features/student/traces/composables/use-trace-associations/use-trace-associations'
import { TraceAssociationTypes } from '@/features/student/traces/types/trace-association.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
