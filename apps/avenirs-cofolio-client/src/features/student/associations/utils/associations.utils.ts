import type { AssociationsDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { Association, AssociationLimits, ElementAssociation } from '@/features/student/associations/types/associations.types'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { ASSOCIATION_CONTEXT_CONFIGS, ASSOCIATION_PAIRS } from '@/features/student/associations/constants/associations.constants'

type AssociationDTO = AssociationsDTO[keyof AssociationsDTO][number]

export function isAssociable (contextType: EAssociationContextType, associatedContextType: EAssociationContextType): boolean {
  return ASSOCIATION_PAIRS.some(
    ([first, second]) =>
      (first === contextType && second === associatedContextType) || (first === associatedContextType && second === contextType),
  )
}

/**
 * Returns the context types an element of the given context type can be associated with, in the enum order.
 */
export function getAssociableContextTypes (contextType: EAssociationContextType): EAssociationContextType[] {
  return Object.values(EAssociationContextType).filter(associatedContextType => isAssociable(contextType, associatedContextType))
}

function getAssociatedElement (association: AssociationDTO): Association {
  if ('trace' in association) {
    return { ...association.trace, contextType: EAssociationContextType.TRACE }
  }
  if ('declaredActivity' in association) {
    return { ...association.declaredActivity, contextType: EAssociationContextType.DECLARED_ACTIVITY }
  }
  if ('skillProgress' in association) {
    return { ...association.skillProgress, contextType: EAssociationContextType.DECLARED_SKILL }
  }
  if ('declaredExperience' in association) {
    return { ...association.declaredExperience, contextType: EAssociationContextType.DECLARED_EXPERIENCE }
  }
  return { ...association.declaredProgram, contextType: EAssociationContextType.DECLARED_PROGRAM }
}

/**
 * Returns the associations of an element to the elements of the given context type.
 */
export function getElementAssociations (
  associations: AssociationsDTO | undefined,
  associatedContextType?: EAssociationContextType | EAssociationContextType[],
): ElementAssociation[] {
  if (!associatedContextType) {
    return []
  }

  const contextTypes = Array.isArray(associatedContextType) ? associatedContextType : [associatedContextType]
  const configs = contextTypes.map(type => ASSOCIATION_CONTEXT_CONFIGS[type]).filter(Boolean)
  if (configs.length === 0) {
    return []
  }

  const elementAssociations = configs.reduce<AssociationDTO[]>(
    (result, config) => {
      result.push(...(associations?.[config.associationsKey] ?? []))
      return result
    },
    []
  )

  return elementAssociations.map((association) => {
    const { id, title, contextType } = getAssociatedElement(association)
    return { associationId: association.associationId, id, title, contextType }
  })
}

export function countAssociations (
  associations: AssociationsDTO | undefined,
  associatedContextTypes: EAssociationContextType[] = Object.values(EAssociationContextType),
): number {
  return associatedContextTypes.reduce(
    (count, associatedContextType) =>
      count + (associations?.[ASSOCIATION_CONTEXT_CONFIGS[associatedContextType].associationsKey].length ?? 0),
    0,
  )
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

export function isAssociationLimitReached (
  limits: AssociationLimits | undefined,
  associatedContextType: EAssociationContextType,
  count: number,
): boolean {
  const limit = limits?.[associatedContextType]
  return isAssociationLimited(limit) && count >= limit
}

/**
 * Returns the kebab case slug of a context type, used to build test ids (e.g. `declared-skill` or `declared-skills`).
 */
export function getContextTypeSlug (contextType: EAssociationContextType | undefined, plural = false): string {
  const slug = (contextType ?? '').toLowerCase().replace(/_/g, '-')

  if (!plural) {
    return slug
  }

  return slug.endsWith('y') ? `${slug.slice(0, -1)}ies` : `${slug}s`
}
