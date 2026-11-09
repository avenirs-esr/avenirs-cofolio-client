import type { DeclaredExperienceViewDTO, EAssociationContextType, SkillProgressDetailsDTO, TraceDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'

export type FeedbackAssociatedElement
  = | { type: EAssociationContextType.TRACE, data: TraceDetailDTO }
    | { type: EAssociationContextType.DECLARED_SKILL, data: SkillProgressDetailsDTO }
    | { type: EAssociationContextType.DECLARED_EXPERIENCE, data: DeclaredExperienceViewDTO }
