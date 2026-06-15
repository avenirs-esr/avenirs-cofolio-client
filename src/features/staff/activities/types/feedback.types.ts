import type { DeclaredSkillProgressDTO, EAssociationContextType, TraceDetailDTO } from '@/api/avenir-esr'

export type FeedbackAssociatedElement =
  | { type: EAssociationContextType.TRACE, data: TraceDetailDTO }
  | { type: EAssociationContextType.DECLARED_SKILL, data: DeclaredSkillProgressDTO }
