import type { DeclaredExperienceViewDTO, DeclaredSkillProgressDetailsDTO, EAssociationContextType, TraceDetailDTO } from '@/api/avenir-esr'

export type FeedbackAssociatedElement =
  | { type: EAssociationContextType.TRACE, data: TraceDetailDTO }
  | { type: EAssociationContextType.DECLARED_SKILL, data: DeclaredSkillProgressDetailsDTO }
  | { type: EAssociationContextType.DECLARED_EXPERIENCE, data: DeclaredExperienceViewDTO }
