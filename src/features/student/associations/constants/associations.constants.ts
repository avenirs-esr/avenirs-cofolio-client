import type { AssociationsDTO } from '@/api/avenir-esr'
import type { AssociationContextConfig } from '@/features/student/associations/types/associations.types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'

/**
 * The pairs of context types that can be associated together, mirroring the API `EAssociationType`.
 * A pair works both ways: supporting a new association only requires declaring its pair here.
 */
export const ASSOCIATION_PAIRS: ReadonlyArray<readonly [EAssociationContextType, EAssociationContextType]> = [
  [EAssociationContextType.DECLARED_ACTIVITY, EAssociationContextType.TRACE],
  [EAssociationContextType.DECLARED_ACTIVITY, EAssociationContextType.DECLARED_SKILL],
  [EAssociationContextType.TRACE, EAssociationContextType.DECLARED_SKILL],
  [EAssociationContextType.TRACE, EAssociationContextType.DECLARED_EXPERIENCE],
  [EAssociationContextType.DECLARED_EXPERIENCE, EAssociationContextType.DECLARED_SKILL],
]

export const ASSOCIATION_CONTEXT_CONFIGS: Record<EAssociationContextType, AssociationContextConfig> = {
  [EAssociationContextType.TRACE]: {
    associationsKey: 'traceAssociations',
    relatedQueryKeys: [['me', 'traces'], ['POST', 'me', 'traces']],
    filterable: true,
    availableInDemo: true,
  },
  [EAssociationContextType.DECLARED_ACTIVITY]: {
    associationsKey: 'declaredActivityAssociations',
    relatedQueryKeys: [['me', 'activity-progress']],
    categoryLabelKeyPrefix: 'global.activities.badges.thematics',
    availableInDemo: true,
  },
  [EAssociationContextType.DECLARED_SKILL]: {
    associationsKey: 'declaredSkillAssociations',
    relatedQueryKeys: [['me', 'declared', 'skill-progress']],
    categoryLabelKeyPrefix: 'student.declaredSkills.declaredSkillTypes',
    availableInDemo: true,
  },
  [EAssociationContextType.DECLARED_EXPERIENCE]: {
    associationsKey: 'declaredExperienceAssociations',
    relatedQueryKeys: [['me', 'declared', 'experiences']],
    categoryLabelKeyPrefix: 'student.personalCareer.declaredExperienceType',
    availableInDemo: false,
  },
}

/**
 * Names of the association dropdown items, also used as their test ids.
 */
export const ASSOCIATION_DROPDOWN_ITEM_NAMES: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: 'traces',
  [EAssociationContextType.DECLARED_ACTIVITY]: 'activities',
  [EAssociationContextType.DECLARED_SKILL]: 'skills',
  [EAssociationContextType.DECLARED_EXPERIENCE]: 'experiences',
}

/**
 * Prefix of every association query key (associations of an element and association searches).
 */
export const ASSOCIATIONS_QUERY_KEY = ['me', 'associations'] as const

export const ASSOCIATION_SEARCH_PAGE_SIZE = 100

export const DEFAULT_ASSOCIATION_SEARCH_FILTER = AssociationSearchFilter.UNASSOCIATED

export const ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED: Record<AssociationSearchFilter, boolean | undefined> = {
  [AssociationSearchFilter.ALL]: undefined,
  [AssociationSearchFilter.ASSOCIATED]: true,
  [AssociationSearchFilter.UNASSOCIATED]: false,
}

export const EMPTY_ASSOCIATIONS: AssociationsDTO = {
  traceAssociations: [],
  declaredActivityAssociations: [],
  declaredSkillAssociations: [],
  declaredExperienceAssociations: [],
}
