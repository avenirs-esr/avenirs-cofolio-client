import type { EAssociationContextType } from '@/api/avenir-esr'

/**
 * msw path parameters used by the association handlers, which answer for any
 * association context type since the API mutualized every association endpoint.
 */
export const anyAssociationContextType = ':contextType' as EAssociationContextType
export const anyAssociatedContextType = ':associatedContextType' as EAssociationContextType
