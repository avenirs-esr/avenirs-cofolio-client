import {
  EAssociationContextType,
  getGetAssociationsQueryKey,
  getGetDeclaredActivityDetailsQueryKey,
  getGetDeclaredExperienceQueryKey,
  getGetDeclaredExperienceViewQueryKey,
  getGetDeclaredSkillProgressDetailsQueryKey,
  getGetTraceDetailQueryKey,
  getGetTracesSummaryQueryKey,
  getSearchForAssociationQueryKey,
  getTracesViewQueryKey
} from '@/api/avenir-esr'
import { ASSOCIATION_CONTEXT_CONFIGS, ASSOCIATIONS_QUERY_KEY } from '@/features/student/associations/constants/associations.constants'
import { invalidateAssociationQueries } from '@/features/student/associations/queries/associations.queries'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, type QueryKey } from '@tanstack/vue-query'
import { beforeEach, expect, vi } from 'vitest'

function startsWith (queryKey: readonly unknown[], prefix: QueryKey) {
  return prefix.every((part, index) => queryKey[index] === part)
}

function isCoveredByContextType (queryKey: readonly unknown[], contextType: EAssociationContextType) {
  return ASSOCIATION_CONTEXT_CONFIGS[contextType].relatedQueryKeys.some(prefix => startsWith(queryKey, prefix))
}

BddTest().given('the association query keys', () => {
  BddTest().then('the associations prefix should match the generated association query keys', () => {
    expect(startsWith(getGetAssociationsQueryKey(EAssociationContextType.TRACE, 'id'), ASSOCIATIONS_QUERY_KEY)).toBe(true)
    expect(startsWith(
      getSearchForAssociationQueryKey(EAssociationContextType.TRACE, 'id', EAssociationContextType.DECLARED_SKILL),
      ASSOCIATIONS_QUERY_KEY
    )).toBe(true)
  })

  BddTest().then('the related query keys should match the generated query keys of each context type', () => {
    expect(isCoveredByContextType(getGetTraceDetailQueryKey('id'), EAssociationContextType.TRACE)).toBe(true)
    expect(isCoveredByContextType(getGetTracesSummaryQueryKey(), EAssociationContextType.TRACE)).toBe(true)
    expect(isCoveredByContextType(getTracesViewQueryKey({}, {}), EAssociationContextType.TRACE)).toBe(true)
    expect(isCoveredByContextType(getGetDeclaredActivityDetailsQueryKey('id'), EAssociationContextType.DECLARED_ACTIVITY)).toBe(true)
    expect(isCoveredByContextType(getGetDeclaredSkillProgressDetailsQueryKey('id'), EAssociationContextType.DECLARED_SKILL)).toBe(true)
    expect(isCoveredByContextType(getGetDeclaredExperienceQueryKey('id'), EAssociationContextType.DECLARED_EXPERIENCE)).toBe(true)
    expect(isCoveredByContextType(getGetDeclaredExperienceViewQueryKey(), EAssociationContextType.DECLARED_EXPERIENCE)).toBe(true)
  })
})

BddTest().given('invalidateAssociationQueries', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue()
  })

  BddTest().when('it is called with the context types of an association', () => {
    beforeEach(async () => {
      await invalidateAssociationQueries(queryClient, [EAssociationContextType.TRACE, EAssociationContextType.DECLARED_SKILL])
    })

    BddTest().then('it should invalidate every association query and the queries of both context types', () => {
      const invalidatedQueryKeys = vi.mocked(queryClient.invalidateQueries).mock.calls.map(([filters]) => filters?.queryKey)

      expect(invalidatedQueryKeys).toEqual([
        ASSOCIATIONS_QUERY_KEY,
        ...ASSOCIATION_CONTEXT_CONFIGS[EAssociationContextType.TRACE].relatedQueryKeys,
        ...ASSOCIATION_CONTEXT_CONFIGS[EAssociationContextType.DECLARED_SKILL].relatedQueryKeys
      ])
    })
  })

  BddTest().when('it is called twice with the same context type', () => {
    beforeEach(async () => {
      await invalidateAssociationQueries(queryClient, [EAssociationContextType.DECLARED_SKILL, EAssociationContextType.DECLARED_SKILL])
    })

    BddTest().then('it should invalidate its queries only once', () => {
      expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(1 + ASSOCIATION_CONTEXT_CONFIGS[EAssociationContextType.DECLARED_SKILL].relatedQueryKeys.length)
    })
  })
})
