import { EAssociationContextType } from '@/api/avenir-esr'
import { useTraceAssociationTypeConfig } from '@/features/student/traces/composables/use-trace-associations/use-trace-associations'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { expect } from 'vitest'

BddTest().given('a useTraceAssociationTypeConfig composable', () => {
  BddTest().when('the composable is initialized', () => {
    const { result: { traceAssociationTypeConfig } } = mountComposable(() => useTraceAssociationTypeConfig(), { useI18n: true })

    BddTest().then('it should build the trace association type config', () => {
      expect(traceAssociationTypeConfig.value).toStrictEqual({
        key: EAssociationContextType.TRACE,
        label: 'Mes traces',
        searchPlaceholder: 'Rechercher une trace...'
      })
    })
  })
})
