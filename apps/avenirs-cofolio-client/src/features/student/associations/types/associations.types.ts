import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { AssociationsDTO, DeclaredActivityAssociationDTO, DeclaredExperienceAssociationDTO, DeclaredProgramAssociationDTO, EAssociationContextType, SkillProgressAssociationDTO, TraceAssociationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { QueryKey } from '@tanstack/vue-query'
import type { AssociatedActivityCardProps } from '@/features/student/associations/components/cards/AssociatedActivityCard/AssociatedActivityCard.vue'
import type { AssociatedDeclaredExperienceCardProps } from '@/features/student/associations/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.vue'
import type { AssociatedDeclaredProgramCardProps } from '@/features/student/associations/components/cards/AssociatedDeclaredProgramCard/AssociatedDeclaredProgramCard.vue'
import type { AssociatedSkillCardProps, } from '@/features/student/associations/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import type { AssociatedTraceCardProps } from '@/features/student/associations/components/cards/AssociatedTraceCard/AssociatedTraceCard.vue'
import type { IdTitle } from '@/types'

/**
 * An element that can be associated, as displayed by the association pickers.
 */
export type Association = IdTitle & AvInteractiveProps & {
  /** Raw category returned by the API (activity thematic, skill type, experience type...). */
  category?: string
  /** The element cannot be associated because it reached its own limit of associations. */
  limitReached?: boolean
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
}

export type AllAssociationsType
  = | TraceAssociationDTO
    | DeclaredActivityAssociationDTO
    | SkillProgressAssociationDTO
    | DeclaredExperienceAssociationDTO
    | DeclaredProgramAssociationDTO

export type AllCardsProps
  = | { associatedTrace: AssociatedTraceCardProps['associatedTrace'] }
    | { declaredActivity: AssociatedActivityCardProps['declaredActivity'] }
    | { declaredSkill: AssociatedSkillCardProps['declaredSkill'] }
    | { declaredExperience: AssociatedDeclaredExperienceCardProps['declaredExperience'] }
    | { declaredProgram: AssociatedDeclaredProgramCardProps['declaredProgram'] }

/**
 * An association of an element, whatever the context type of the associated element.
 */
export interface ElementAssociation extends IdTitle {
  associationId: string
}
