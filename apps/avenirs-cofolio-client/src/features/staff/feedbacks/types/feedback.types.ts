import type { DeclaredExperienceViewDTO, EAssociationContextType, SkillProgressDetailsDTO, TraceDetailDTO } from '@/api/avenir-esr'

export type FeedbackAssociatedElement
  = | { type: EAssociationContextType.TRACE, data: TraceDetailDTO }
    | { type: EAssociationContextType.DECLARED_SKILL, data: SkillProgressDetailsDTO }
    | { type: EAssociationContextType.DECLARED_EXPERIENCE, data: DeclaredExperienceViewDTO }
