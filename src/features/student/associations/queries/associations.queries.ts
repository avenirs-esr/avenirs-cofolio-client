import type { EAssociationContextType } from '@/api/avenir-esr'
import type { QueryClient, QueryKey } from '@tanstack/vue-query'
import { ASSOCIATION_CONTEXT_CONFIGS, ASSOCIATIONS_QUERY_KEY } from '@/features/student/associations/constants/associations.constants'

/**
 * Invalidates every association query along with the queries of the given context types,
 * since an association change impacts both associated elements.
 */
export async function invalidateAssociationQueries (queryClient: QueryClient, contextTypes: EAssociationContextType[]) {
  const queryKeys: QueryKey[] = [
    ASSOCIATIONS_QUERY_KEY,
    ...[...new Set(contextTypes)].flatMap(contextType => ASSOCIATION_CONTEXT_CONFIGS[contextType].relatedQueryKeys)
  ]

  await Promise.all(queryKeys.map(queryKey => queryClient.invalidateQueries({ queryKey })))
}
