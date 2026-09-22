import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { IdTitle } from '@/types'
import type { QueryKey } from '@tanstack/vue-query'

/**
 * An element that can be associated, as displayed by the association pickers.
 * `category` holds the raw category returned by the API (activity thematic, skill type, experience type...)
 * while `description` holds its translation.
 */
export type Association = IdTitle & {
  disabled?: boolean
  category?: string
}

/**
 * The elements selected to be associated, grouped by the context type they belong to.
 */
export type AssociationSelections = Partial<Record<EAssociationContextType, Association[]>>

/**
 * The maximum number of elements of a context type that can be associated with an element.
 * A negative value means no limit.
 */
export type AssociationLimits = Partial<Record<EAssociationContextType, number>>

export enum AssociationSearchFilter {
  ALL = 'ALL',
  ASSOCIATED = 'ASSOCIATED',
  UNASSOCIATED = 'UNASSOCIATED'
}

export interface AssociationContextConfig {
  /** Key of the `AssociationsDTO` list holding the associations to elements of this context type. */
  associationsKey: keyof AssociationsDTO
  /** Queries holding data impacted when an element of this context type is associated or unassociated. */
  relatedQueryKeys: QueryKey[]
  /** i18n key prefix used to translate the category returned by the association search. */
  categoryLabelKeyPrefix?: string
  /** Whether the association search of this context type can be filtered on the association status. */
  filterable?: boolean
  /** Whether this context type can be associated in demo mode. */
  availableInDemo?: boolean
}

/**
 * An association of an element, whatever the context type of the associated element.
 */
export interface ElementAssociation extends IdTitle {
  associationId: string
}
