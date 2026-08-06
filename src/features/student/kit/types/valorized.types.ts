import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'

export enum ValorizedItemType {
  ASSOCIATED_TRACE = 'ASSOCIATED_TRACE',
  DECLARED_EXPERIENCE = 'DECLARED_EXPERIENCE',
  DECLARED_PROGRAM = 'DECLARED_PROGRAM',
  DECLARED_SKILL = 'DECLARED_SKILL',
  NON_ASSOCIATED_TRACE = 'NON_ASSOCIATED_TRACE',
}

export type ValorizedElementType = ValorizedItemType | ESelfKnowledgeCategory
