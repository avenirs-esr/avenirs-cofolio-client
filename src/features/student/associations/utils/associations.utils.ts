import type { AssociationsDTO } from '@/api/avenir-esr'
import type { AssociationLimits, ElementAssociation } from '@/features/student/associations/types/associations.types'
import type { IdTitle } from '@/types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ASSOCIATION_CONTEXT_CONFIGS, ASSOCIATION_PAIRS } from '@/features/student/associations/constants/associations.constants'

type AssociationDTO = AssociationsDTO[keyof AssociationsDTO][number]

export function isAssociable (contextType: EAssociationContextType, associatedContextType: EAssociationContextType): boolean {
  return ASSOCIATION_PAIRS.some(([first, second]) =>
    (first === contextType && second === associatedContextType)
    || (first === associatedContextType && second === contextType))
}

/**
 * Returns the context types an element of the given context type can be associated with, in the enum order.
 */
export function getAssociableContextTypes (contextType: EAssociationContextType): EAssociationContextType[] {
  return Object.values(EAssociationContextType).filter(associatedContextType => isAssociable(contextType, associatedContextType))
}

/**
 * Whether new associations to elements of the given context type can be made, some being unavailable in demo mode.
 */
export function canAssociateContextType (associatedContextType: EAssociationContextType): boolean {
  return !__DEMO_MODE__ || !!ASSOCIATION_CONTEXT_CONFIGS[associatedContextType].availableInDemo
}

function getAssociatedElement (association: AssociationDTO): IdTitle {
  if ('trace' in association) {
    return association.trace
  }
  if ('declaredActivity' in association) {
    return association.declaredActivity
  }
  if ('declaredSkill' in association) {
    return association.declaredSkill
  }
  return association.declaredExperience
}

/**
 * Returns the associations of an element to the elements of the given context type.
 */
export function getElementAssociations (
  associations: AssociationsDTO | undefined,
  associatedContextType: EAssociationContextType
): ElementAssociation[] {
  const elementAssociations: AssociationDTO[] = associations?.[ASSOCIATION_CONTEXT_CONFIGS[associatedContextType].associationsKey] ?? []

  return elementAssociations.map((association) => {
    const { id, title } = getAssociatedElement(association)
    return { associationId: association.associationId, id, title }
  })
}

export function countAssociations (
  associations: AssociationsDTO | undefined,
  associatedContextTypes: EAssociationContextType[] = Object.values(EAssociationContextType)
): number {
  return associatedContextTypes.reduce((count, associatedContextType) =>
    count + (associations?.[ASSOCIATION_CONTEXT_CONFIGS[associatedContextType].associationsKey].length ?? 0), 0)
}

/**
 * Counts the associations of an element of the given context type.
 */
export function countElementAssociations (contextType: EAssociationContextType, associations: AssociationsDTO | undefined): number {
  return countAssociations(associations, getAssociableContextTypes(contextType))
}

export function isAssociationLimited (limit: number | undefined): limit is number {
  return limit !== undefined && limit >= 0
}

export function isAssociationLimitReached (limits: AssociationLimits | undefined, associatedContextType: EAssociationContextType, count: number): boolean {
  const limit = limits?.[associatedContextType]
  return isAssociationLimited(limit) && count >= limit
}

/**
 * Returns the kebab case slug of a context type, used to build test ids (e.g. `declared-skill` or `declared-skills`).
 */
export function getContextTypeSlug (contextType: EAssociationContextType, plural = false): string {
  const slug = contextType.toLowerCase().replace(/_/g, '-')

  if (!plural) {
    return slug
  }

  return slug.endsWith('y') ? `${slug.slice(0, -1)}ies` : `${slug}s`
}
