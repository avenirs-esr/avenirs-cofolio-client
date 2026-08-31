import type { EAssociationContextType } from '@/api/avenir-esr'

export type DeclaredExperienceAssociationContextType = Exclude<EAssociationContextType, 'DECLARED_EXPERIENCE'>
